import * as z from "zod";

// zod library is for defining type schemas during runtime
export const LeadAnalysisSchema = z.object({
    analyses: z.array(
      z.object({
        lead_id: z.number(),
        summary: z.string(),
        category: z.string(),
        urgency: z.enum(["Low", "Medium", "High"]),
        sentiment: z.enum(["Negative", "Neutral", "Positive"]),
        suggested_reply: z.string(),
        next_action: z.string(),
      })
    ),
});

const LeadRowSchema = z.object({
    fname: z.string(),
    lname: z.string(),
    email: z.string().email(),
    company: z.string(),
    message: z.string(),
    source: z.string(),
});

export const ImportLeadsSchema = z.array(LeadRowSchema);

