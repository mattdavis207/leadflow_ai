/* This file will contain the Next.js API endpoint for taking the lead data and calling OpenAI API to analyze 
and spit out a response */

import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db"
import { GetLeadAnalysis } from "@/lib/openai/openai_api";
import type { LeadAnalysisRow } from "@/lib/types";

export async function POST(){
    try {
        const text = 'SELECT * FROM get_pending_leads()'

        const data = await db.query(text);

        const chunkSize = 5;
        const pendingLeads = data.rows; 

        const result_analyses = [];

        for (let i = 0; i < pendingLeads.length; i+= chunkSize){
            const chunk = pendingLeads.slice(i, i+ chunkSize);
            const result = await GetLeadAnalysis(chunk);
            console.log("chunk ", i, " ran");
            result_analyses.push(...(result?.analyses ?? [])) // spread operator spreads the push over all the analysis objects
        }

        // now add to lead_analysis table 
        const add_la_query = "CALL add_lead_analysis($1, $2, $3, $4, $5, $6, $7, $8)";

        for (const values of result_analyses.map((analysis) => [
            analysis.lead_id,
            analysis.summary,
            analysis.category,
            analysis.urgency,
            analysis.sentiment,
            analysis.suggested_reply,
            analysis.next_action,
            analysis
        ]) ) {
            await db.query(add_la_query, values);
        }

        // update analysis_status to "Complete" for analyzed leads
        const lead_ids = result_analyses.map(analysis => analysis.lead_id);

        const update_status_query = "CALL update_analysis_status($1::integer[]);"

        await db.query(update_status_query, [lead_ids])



        return NextResponse.json({
            success: true,
            message: "Leads successfully analyzed."
        })

    } catch (err){
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500,
            err: err
        })
    }
}
