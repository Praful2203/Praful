import { groq } from './groq';

export interface Responder {
  id: string;
  name: string;
  skills: string[];
  status: 'available' | 'busy' | 'offline';
  distanceToIncidentKm: number;
}

export interface IncidentDetails {
  title: string;
  description: string;
  severity: string;
}

export async function assignResponder(incident: IncidentDetails, availableResponders: Responder[]) {
  const prompt = `
You are an expert AI dispatcher for a Hyperlocal Emergency Response Platform.
An incident has just been reported:
Title: ${incident.title}
Description: ${incident.description}
Severity: ${incident.severity}

Here are the available responders:
${JSON.stringify(availableResponders, null, 2)}

Your task is to assign the best responder based on their skills, availability, and distance to the incident.
Respond ONLY with a JSON object in the following format, with no extra text:
{
  "assignedResponderId": "responder_id_here",
  "rationale": "Brief explanation of why this responder was chosen."
}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a specialized JSON-only output agent. Never output markdown formatting or conversational text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192", // Using Llama 3 on Groq
      temperature: 0.1, // Keep it deterministic
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (responseContent) {
      return JSON.parse(responseContent) as { assignedResponderId: string; rationale: string };
    }
    
    return null;
  } catch (error) {
    console.error("Error in AI Dispatcher:", error);
    return null;
  }
}
