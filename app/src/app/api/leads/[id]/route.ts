import { NextRequest, NextResponse } from "next/server";
import * as db from '@/lib/db'


export async function GET(request: NextRequest, { params }: { params: Promise<{id: string}>}){
    try {
        const { id } = await params;

        const text = 'SELECT * FROM get_lead_by_id($1)'

        const data = await db.query(text, [Number(id)]);

        if (data.rows.length === 0 ){
            return NextResponse.json(
                {
                data: data.rows[0],
                success: false,
                message: "Lead data not retrieved.",
                },
                { status: 404 }
            )
        }

        console.log("data", data.rows[0]);
        
        return NextResponse.json(
            {
            data: data.rows[0],
            success: true,
            message: "Lead data retrieved successfully",
            },
            { status: 200 }
        )
    } catch (err){
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500,
            err: err
        })
    }
}