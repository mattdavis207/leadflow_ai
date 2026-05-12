import * as z from "zod";

// zod library is for defining type schemas during runtime

const LeadRowSchema = z.object({
    fname: z.string(),
    lname: z.string(),
    email: z.string().email(),
    company: z.string(),
    message: z.string(),
    source: z.string(),
});

export const ImportLeadsSchema = z.array(LeadRowSchema);