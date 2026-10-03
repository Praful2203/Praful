'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Incident, Responder } from '@/types/emergency';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  LocateFixed, 
  Maximize2,
  AlertTriangle,
  Ambulance,
  HeartHandshake,
  Construction,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveMapProps {
  incident: Incident;
  responders: Responder[];
  className?: string;
  enableLiveUserGps?: boolean;
}

export function LiveMap({ incident, responders, className, enableLiveUserGps = true }: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const routePolylineRef = useRef<any>(null);
  const userGpsMarkerRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState<'streets' | 'hybrid'>('streets');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'LOCATING' | 'ACTIVE' | 'DENIED' | 'UNAVAILABLE'>('LOCATING');

  const activeResponder = incident.assignedResponder || responders[0];
  const isDelayed = incident.status === 'DELAY_DETECTED' || incident.status === 'REPLANNING';
  const isTier2NGO = incident.currentTier === 'TIER_2';
  const isRoadHazard = incident.type === 'ROAD_HAZARD';

  // 1. Real-time Browser Geolocation API
  useEffect(() => {
    if (!enableLiveUserGps || typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('UNAVAILABLE');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsStatus('ACTIVE');
      },
      (err) => {
        console.warn('Geolocation access status:', err.message);
        setGpsStatus(err.code === 1 ? 'DENIED' : 'UNAVAILABLE');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableLiveUserGps]);

  // 2. Initialize Real Leaflet / Esri Hybrid Satellite Map safely
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      const container = mapContainerRef.current as any;
      if (mapInstanceRef.current || (container && container._leaflet_id)) {
        return;
      }

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Double check container was not initialized while awaiting import
      if ((mapContainerRef.current as any)._leaflet_id) return;

      const initialCenter = [incident.location.lat, incident.location.lng];

      try {
        const map = L.map(mapContainerRef.current, {
          center: initialCenter as [number, number],
          zoom: 14,
          minZoom: 3,
          zoomControl: false,
          attributionControl: false
        });

        // 1. High Resolution Satellite Imagery Base Layer (100% Watermark Free)
        const satelliteBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: ''
        });
        satelliteBase.addTo(map);

        // 2. Clear Hybrid Overlay: State Borders, National Boundaries & City Names (100% Watermark Free)
        const hybridReferenceOverlay = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          pane: 'overlayPane',
          attribution: ''
        });
        hybridReferenceOverlay.addTo(map);

        // Add Zoom control on bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.warn('Map initialization caught handled gracefully:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map remove cleanup:', e);
        }
        mapInstanceRef.current = null;
      }
      markersRef.current = {};
      routePolylineRef.current = null;
      userGpsMarkerRef.current = null;
    };
  }, []);

  // 4. Update Markers (Incident, Assigned Responders, User GPS) & Live Route
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    import('leaflet').then(({ default: L }) => {
      const map = mapInstanceRef.current;

      // 4.1. Incident Marker (Burgundy / Red Pulse)
      const incidentIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
        </div>
      `;
      const incidentIcon = L.divIcon({
        html: incidentIconHtml,
        className: 'custom-incident-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (markersRef.current.incident) {
        markersRef.current.incident.setLatLng([incident.location.lat, incident.location.lng]);
      } else {
        markersRef.current.incident = L.marker([incident.location.lat, incident.location.lng], { icon: incidentIcon })
          .addTo(map)
          .bindPopup(`<strong>${incident.id}</strong><br/>${incident.type} - ${incident.address}`);
      }

      // 4.2. Responders Markers
      responders.forEach((resp) => {
        const isActive = activeResponder?.id === resp.id;
        const isCorp = resp.id === 'CORP-301';
        const isNGO = resp.tier === 'TIER_2';

        const bgClass = isCorp
          ? 'bg-amber-600'
          : isNGO
            ? 'bg-emerald-600'
            : isDelayed
              ? 'bg-red-600'
              : 'bg-blue-600';

        const responderIconHtml = `
          <div class="relative flex items-center justify-center">
            ${isActive ? '<div class="absolute -inset-1.5 rounded-full bg-blue-500/25 animate-pulse"></div>' : ''}
            <div class="w-7 h-7 rounded-full ${bgClass} text-white flex items-center justify-center shadow-md border-2 border-white">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
          </div>
        `;

        const respIcon = L.divIcon({
          html: responderIconHtml,
          className: `custom-resp-pin-${resp.id}`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        if (markersRef.current[resp.id]) {
          markersRef.current[resp.id].setLatLng([resp.location.lat, resp.location.lng]);
        } else {
          markersRef.current[resp.id] = L.marker([resp.location.lat, resp.location.lng], { icon: respIcon })
            .addTo(map)
            .bindPopup(`<strong>${resp.name}</strong><br/>${resp.organization}<br/>Status: ${resp.status}`);
        }
      });

      // 4.3. Real-Time User GPS Marker (Blue Dot like Google Maps)
      if (userLocation) {
        const userGpsHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
          </div>
        `;
        const userGpsIcon = L.divIcon({
          html: userGpsHtml,
          className: 'custom-user-gps-dot',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        if (userGpsMarkerRef.current) {
          userGpsMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        } else {
          userGpsMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userGpsIcon })
            .addTo(map)
            .bindPopup('<strong>Your Real-time Location</strong><br/>Captured via browser Geolocation API');
        }
      }

      // 4.4. Route Polyline
      const isCorp = activeResponder?.id === 'CORP-301';
      const routePoints: [number, number][] = [
        [activeResponder.location.lat, activeResponder.location.lng],
        [(activeResponder.location.lat + incident.location.lat) / 2 + 0.001, (activeResponder.location.lng + incident.location.lng) / 2 - 0.001],
        [incident.location.lat, incident.location.lng]
      ];

      const routeColor = isCorp ? '#D97706' : isTier2NGO ? '#16A34A' : isDelayed ? '#DC2626' : '#2563EB';

      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(routePoints);
        routePolylineRef.current.setStyle({ color: routeColor, dashArray: isDelayed ? '6, 6' : undefined });
      } else {
        routePolylineRef.current = L.polyline(routePoints, {
          color: routeColor,
          weight: 4,
          opacity: 0.85,
          dashArray: isDelayed ? '6, 6' : undefined
        }).addTo(map);
      }
    });
  }, [incident, responders, userLocation, mapLoaded, activeResponder, isDelayed, isTier2NGO, isRoadHazard]);

  // Recenter Map on Incident Coordinates
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([incident.location.lat, incident.location.lng], 15, { duration: 1 });
    }
  };

  // Center on Real-time User Geolocation
  const handleCenterUserGps = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 1 });
    } else {
      handleRecenter();
    }
  };

  return (
    <div className={cn(
      'relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-[#E8E2D2] bg-[#F7F3EA] flex flex-col justify-between card-shadow select-none group',
      className
    )}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Map HUD Controls */}
      <div className="relative z-10 p-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-[#E8E2D2] text-xs font-mono text-[#17202A] card-shadow backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-[#800020]">REALTIME GPS:</span>
          <span>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</span>
        </div>

        {/* Layer Toggle & Geolocation Tracking Badges */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 border border-[#E8E2D2] text-[11px] font-bold text-[#800020] card-shadow backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-[#800020]" />
            <span>Hybrid Map</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 border border-[#E8E2D2] text-[11px] font-semibold text-[#667085] card-shadow backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{gpsStatus === 'ACTIVE' ? `Live GPS (±${gpsAccuracy || 5}m)` : 'GPS Active'}</span>
          </div>

          <button
            onClick={handleCenterUserGps}
            className="p-1.5 rounded-xl bg-white/95 hover:bg-[#FFFDF8] border border-[#E8E2D2] text-[#800020] card-shadow transition"
            title="My Current Location (Browser Geolocation API)"
          >
            <LocateFixed className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-xl bg-white/95 hover:bg-[#FFFDF8] border border-[#E8E2D2] text-[#17202A] card-shadow transition"
            title="Recenter Map on Incident"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Map Status Footer (Google Maps Style HUD) */}
      <div className="relative z-10 p-3 bg-white/95 border-t border-[#E8E2D2] flex flex-wrap items-center justify-between text-xs text-[#667085] pointer-events-auto backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#800020] animate-pulse" />
          <span className="font-medium">Active Telemetry:</span>
          <strong className="text-[#17202A]">
            {activeResponder?.name} ({activeResponder?.distanceKm} km)
          </strong>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-[#667085]">Corridor: <strong className="text-[#17202A]">{incident.address.split(',')[0]}</strong></span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            ETA {incident.estimatedTimeArrival}
          </span>
        </div>
      </div>
    </div>
  );
}
