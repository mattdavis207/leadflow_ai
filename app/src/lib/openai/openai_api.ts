import OpenAI from "openai";
import type { DBLeadRow } from "../types";
import { LeadAnalysisSchema } from "../schemas";
import { zodTextFormat } from "openai/helpers/zod.js";

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
}  

const client = new OpenAI({ apiKey });

const LEAD_ANALYSIS_PROMPT = `
You analyze inbound sales leads for Leadflow AI.

For each lead:
- Summarize the inquiry in one sentence.
- Classify urgency as Low, Medium, or High.
- Classify category.
- Detect sentiment.
- Write a suggested reply.
- Recommend a next action.

Only use the provided lead data.
`;


export async function GetLeadAnalysis(data: DBLeadRow[]){
    const response = await client.responses.parse({
        model: process.env.OPENAI_MODEL,
        input: [
            {
                role: "system",
                content: LEAD_ANALYSIS_PROMPT
            },
            {
                role: "user",
                content: JSON.stringify({data})
            }
        ],
        text: {
            format: zodTextFormat(LeadAnalysisSchema, "lead_analysis")
        }
    });
    
    return response.output_parsed;
}

