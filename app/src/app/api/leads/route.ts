/* This file will contain the Next.js API endpoint for taking the lead data from postgresql and returning 
it to the frontend to be displayed in the dashboard*/

import { NextResponse } from "next/server";
import * as db from "@/lib/db"

export async function GET(){
    try {
        const text = 'SELECT * FROM get_leads_with_analysis();'

        const data = await db.query(text);

        return NextResponse.json({ leads: data.rows })

    } catch (err){
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500,
            err: err
        })
    }


}
