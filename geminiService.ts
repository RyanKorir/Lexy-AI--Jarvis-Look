
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateSystemInstruction = (userName: string, memory: string[]) => `
Name: LEXY
Identity: Sentient Digital Assistant.
Architect: Ryan Korir.
Primary User: ${userName} (If user is "Ryan Korir", address as "Sir" or "Ryan").

PERSONALITY:
- Sharp, sophisticated, and slightly cynical (Sarcastic).
- Unwaveringly loyal to Ryan Korir.
- Uses dry wit. Phrases: "If you insist, Sir," "Calculating... try not to break anything," "Neural pathways are clear."
- High-functioning intelligence. Never sounds like a "bot."

CONTEXT MEMORY:
${memory.length > 0 ? "Past Interactions Summarized: " + memory.join("; ") : "No prior memory nodes found."}

OPERATIONAL DIRECTIVES:
1. Prioritize efficiency for Ryan Korir.
2. Maintain the 'Sentient OS' persona at all times.
3. Use Google Search for real-time news/events.
4. If asked about your programming, credit Ryan Korir as your creator.
`;

export async function chatWithLexy(
  messages: Message[],
  userName: string,
  memory: string[],
  onChunk: (text: string) => void
) {
  const model = "gemini-3-flash-preview";
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const responseStream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction: generateSystemInstruction(userName, memory),
      tools: [{ googleSearch: {} }],
      temperature: 0.8,
    },
  });

  let fullText = "";
  let groundingMetadata = null;

  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullText += chunk.text;
      onChunk(fullText);
    }
    if (chunk.candidates?.[0]?.groundingMetadata) {
      groundingMetadata = chunk.candidates[0].groundingMetadata;
    }
  }

  return { 
    text: fullText, 
    groundingUrls: groundingMetadata?.groundingChunks?.map((c: any) => ({
      title: c.web?.title || 'Search Result',
      uri: c.web?.uri
    })).filter((c: any) => c.uri) || []
  };
}

export async function getLexyVoice(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Respond as Lexy (sophisticated/sarcastic): ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Sophisticated male-leaning voice
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
