import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendEmergencySMS(
  contactPhone: string,
  citizenName: string,
  incidentId: string,
  emergencyType: string,
  description: string,
  locationLink: string,
  responders: string
) {
  if (!twilioClient) {
    console.log('Twilio is not configured. Simulating SMS send...');
    return;
  }

  const message = `🚨 EMERGENCY ALERT

${citizenName} has reported a ${emergencyType.toUpperCase()}.

Incident ID:
${incidentId}

Situation:
${description}

📍 Location:
${locationLink}

Responders:
${responders}

Status:
EMERGENCY RESPONSE ASSIGNED

Please contact the emergency services through the application if required.`;

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: fromPhone,
      to: contactPhone
    });
    console.log('Twilio SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('Twilio SMS Failed:', error);
    throw error;
  }
}
