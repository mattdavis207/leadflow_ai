'use client'

import { useEffect, useState, useCallback } from "react";
import { columns, DBFullLeadRow } from "./columns";
import { DataTable } from "./data-table";


export default function Dashboard() {

    const [data, setData] = useState<DBFullLeadRow[]>([])


    const fetchLeads = useCallback(async () => {
        try{
            const response = await fetch("/api/leads");

            if (!response.ok){
                throw new Error("Failed to fetch leads.");
            }

            const json = await response.json();
            
            // map json to the rows 
            const rows = json.leads;
            const leads: DBFullLeadRow[] = rows.map((row: DBFullLeadRow) => ({
                lead_id: row.lead_id,
                fname: row.fname,
                lname: row.lname,
                email: row.email,
                company: row.company,
                message: row.message,
                source: row.source,
                created_at: new Date(row.created_at),
                analysis_status: row.analysis_status,
                summary: row.summary,
                category: row.category,
                urgency: row.urgency,
                sentiment: row.sentiment,
                suggested_reply: row.suggested_reply,
                next_action: row.next_action,
            }));
            
            setData(leads);

        } catch (err){
            console.error("Error loading leads:", err);
        }
        
    }, []);

    // fetches analysis data for leads
    async function handleAnalyze(){
        try{
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok){
                throw new Error("Failed to fetch leads.");
            }

            const result = await response.json();
            console.log("Message: ", result.message);

            // Reload state with updated data
            await fetchLeads();

        } catch (err){
            console.error("Error analyzing leads:", err);
        }
    }

    // fetches leads for dashboard on page load
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeads();
    }, [fetchLeads])

    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <section className="mx-auto w-full max-w-6xl">
                {data ? 
                <DataTable columns={columns} data={data} onAnalyzePending={handleAnalyze}/> 
                : null}
            </section>
        </main>
    );
}
