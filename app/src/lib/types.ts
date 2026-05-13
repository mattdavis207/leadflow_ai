
export type LeadRow = {
    fname: string;
    lname: string;
    email: string;
    company: string;
    message: string;
    source: string;
}

export type DBLeadRow = {
    lead_id: number,
    fname: string;
    lname: string;
    email: string;
    company: string;
    message: string;
    source: string;
    created_at: Date,
    analysis_status: string
}

export type LeadAnalysisRow = {
    lead_id: number,
    summary: string,
    urgency: "Low" | "Medium" | "High",
    category: string,
    sentiment: "Negative" | "Neutral" | "Positive",
    suggested_reply: string,
    next_action: string
}
