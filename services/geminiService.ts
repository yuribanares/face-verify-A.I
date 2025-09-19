
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from '../types';

// Utility function to convert a data URL to a GoogleGenerativeAI.Part
function fileToGenerativePart(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL');
  }
  const mimeType = match[1];
  const data = match[2];

  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

export const compareFaces = async (
  selfieBase64: string,
  uploadedImageBase64: string
): Promise<ComparisonResult> => {
  {/* if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
*/}
  const ai = new GoogleGenAI({ apiKey: `AIzaSyCPmzGDCcir_57UFO4Xn2eX_BPddoruAlk` });

  const selfiePart = fileToGenerativePart(selfieBase64);
  const uploadedImagePart = fileToGenerativePart(uploadedImageBase64);

  const prompt = `Carefully analyze the two attached images. The first is a live selfie, the second is an uploaded photo. Determine if they depict the same person. Provide your response as a JSON object with two fields: 'match', a boolean which is true if it's the same person and false otherwise, and 'reasoning', a brief, one-sentence explanation for your decision.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          selfiePart,
          uploadedImagePart,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match: { type: Type.BOOLEAN, description: "True if the faces match, false otherwise." },
            reasoning: { type: Type.STRING, description: "A brief explanation of the result." },
          },
          required: ['match', 'reasoning'],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as ComparisonResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI. Please try again.");
  }
};
