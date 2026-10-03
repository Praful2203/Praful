import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { assignResponder, Responder } from '../lib/ai-dispatcher';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const status = req.query.status as string;

  let query = supabase.from('incidents').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  // Order by created_at descending
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching incidents:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title: emergencyType, description, location, userId } = req.body;
    
    if (!emergencyType || !description) {
      return res.status(400).json({ error: 'Missing emergencyType or description' });
    }

    // 1. Fetch real available responders from Supabase
    const { data: availableResponders, error: fetchErr } = await supabase
      .from('responders')
      .select('*')
      .eq('status', 'available');

    if (fetchErr) {
      console.error('Error fetching responders:', fetchErr);
    }

    // 2. Call AI to analyze and assign
    const aiAssignment = await assignResponder({
      title: emergencyType,
      description: description,
    }, availableResponders || []);

    // 3. Insert Incident into Supabase
    const { data: newIncidentData, error: insertErr } = await supabase
      .from('incidents')
      .insert([
        {
          title: emergencyType,
          description: description,
          location: location || { lat: 0, lng: 0 },
          severity: aiAssignment?.severity || 'MEDIUM',
          status: aiAssignment?.assignedResponderId ? 'assigned' : 'reported',
          reported_by: userId || null,
          assigned_responder_id: aiAssignment?.assignedResponderId || null,
          ai_rationale: aiAssignment?.rationale || 'AI evaluation pending',
        }
      ])
      .select('*, responders(*)')
      .single();

    if (insertErr) {
      console.error('Database Insert Error:', insertErr);
      return res.status(500).json({ error: 'Failed to create incident in database' });
    }

    // 4. Trigger Twilio Alert (Non-blocking)
    try {
      const { sendEmergencySMS } = await import('../lib/twilio');
      await sendEmergencySMS(
        '+1234567890', // In a real app, query emergency_contacts here
        'Citizen',
        newIncidentData.id,
        emergencyType,
        description,
        `https://maps.google.com/?q=${location?.lat},${location?.lng}`,
        aiAssignment?.assignedResponderId ? 'Responders Assigned' : 'Pending'
      );
    } catch (smsErr) {
      console.error('Twilio SMS Failed (Incident still created):', smsErr);
    }

    // 5. Return structured result to frontend
    return res.status(201).json({
      incident: newIncidentData,
      severity: aiAssignment?.severity || 'MEDIUM',
      priority: aiAssignment?.priority || 'URGENT',
      ai_rationale: aiAssignment?.rationale,
      assignments: aiAssignment?.assignedResponderId ? [{
        responderId: aiAssignment.assignedResponderId,
        status: 'ASSIGNED'
      }] : []
    });

  } catch (err) {
    console.error('Exception in POST /api/incidents:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
