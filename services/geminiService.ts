import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const apiKey = process.env.API_KEY || ''; 
// We are careful not to crash if key is missing, but functions will fail gracefully.

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const getMagicalHint = async (teamName: string, context: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning fallback hint.");
    return "The stars are cloudy... try focusing on the team's main function.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a magical Sorting Hat from a wizarding world, but you know about Comic Con logistics.
      A volunteer is stuck on the crossword puzzle team name: "${teamName}".
      The description of the team is: "${context}".
      
      Give a cryptic but helpful hint (max 15 words) in the style of the Sorting Hat. 
      Do NOT reveal the name directly. 
      Focus on what they DO.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "The magic fades... try again.";
  } catch (error) {
    console.error("Error fetching magical hint:", error);
    return "The connection to the wizarding world is weak.";
  }
};
