import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get("id");

        const text = 'SELECT * FROM get_lead_by_id'


    } catch (err){
        return NextResponse.json({
            error: "Internal Server Error",
            code: 500,
            err: err
        })
    }
}