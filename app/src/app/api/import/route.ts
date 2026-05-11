/* This file will contain the Next.js API endpoint for parsing the lead data from a csv input and storing it 
in postgresql */

import { ImportLeadsSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db"

export async function POST(request: NextRequest){
    try {
        const body = await request.json();

        // enforce schema type
        const result = ImportLeadsSchema.safeParse(body);

        if (!result.success){
            return NextResponse.json({
                error: 'Invalid schema type',
                code: 400
            })
        }

        const leadData = result.data;

        // call library function to save data to postgresql
        const text = 'CALL add_lead($1, $2, $3, $4, $5, $6);'

        // loop through arrays and call procedure to insert
        for (const values of leadData.map((lead) => [
            lead.fname,
            lead.lname,
            lead.email,
            lead.company,
            lead.message,
            lead.source
        ])) {
            await db.query(text, values);
        }

        return NextResponse.json(
            {
            success: true,
            importedCount: leadData.length,
            message: "Leads imported successfully",
            },
            { status: 201 }
        )

    } catch (err) {
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500
        })
    }
    
};
