import { GoogleGenAI } from "@google/genai";
import { Deal } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeDealRisks = async (deal: Deal): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key not configured. Unable to analyze.";

  const prompt = `
    Act as a Senior Sales Director for a Data & AI Consultancy.
    Analyze the following deal and provide a concise 3-bullet point assessment focused on risks and next steps to increase closing probability.
    
    Deal Context:
    - Title: ${deal.title}
    - Client: ${deal.client}
    - Type: ${deal.serviceType}
    - Value: ${deal.value} ${deal.currency}
    - Current Stage: ${deal.stage}
    - Probability: ${deal.probability}%
    - Next Step: ${deal.nextStep}
    - Est. Hours: ${deal.estimatedHours}
    
    Keep it professional, strategic, and under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating insights. Please try again.";
  }
};

export const generatePipelineReport = async (deals: Deal[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "API Key not configured.";

    const summary = deals.map(d => `${d.title} (${d.stage}, ${d.value})`).join('\n');

    const prompt = `
      You are a Sales Ops Lead. Summarize the health of this sales pipeline for a Data/AI company.
      Highlight 1 major opportunity and 1 potential bottleneck.
      
      Deals:
      ${summary}
    `;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        return response.text || "No report generated.";
      } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating report.";
      }
}
