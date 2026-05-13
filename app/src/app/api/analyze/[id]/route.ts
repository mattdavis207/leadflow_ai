/* This file will contain the Next.js API endpoint for taking a lead id and calling OpenAI API to analyze 
and spit out a response */

import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db"
import { GetLeadAnalysis } from "@/lib/openai/openai_api";
import type { LeadAnalysisRow } from "@/lib/types";

export async function POST(request: NextRequest, { params }: { params: Promise<{id: string}>}){
    try {

        const { id } = await params;

        const text = 'SELECT * FROM get_pending_leads_id($1)'

        const data = await db.query(text, [Number(id)]);

        const result = await GetLeadAnalysis(data.rows);

        if (result?.analyses.length === 0){
            return NextResponse.json({
                success: false,
                message: "Lead Analysis Failed",
                code: 404
            })
        }
        
        const lead_analysis = result?.analyses[0];

        
        // now add to lead_analysis table 
        const add_la_query = "CALL add_lead_analysis($1, $2, $3, $4, $5, $6, $7, $8)";

        const values = [
            lead_analysis?.lead_id,
            lead_analysis?.summary,
            lead_analysis?.category,
            lead_analysis?.urgency,
            lead_analysis?.sentiment,
            lead_analysis?.suggested_reply,
            lead_analysis?.next_action,
            lead_analysis
        ];
        
        await db.query(add_la_query, values);

        // update analysis_status to "Complete" for analyzed lead
        const lead_id = [values[0]];

        const update_status_query = "CALL update_analysis_status($1::integer[]);"

        await db.query(update_status_query, [lead_id])


        return NextResponse.json({
            success: true,
            message: "Lead successfully analyzed.",
            code: 200
        })

    } catch (err){
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500,
            err: err
        })
    }
}



