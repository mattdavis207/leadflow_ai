'use client'

import { useEffect, useState } from "react";
import { columns, DBLeadRow } from "./columns";
import { DataTable } from "./data-table";


export default function Dashboard() {

    const [data, setData] = useState<DBLeadRow[]>([])

    // fetches leads for dashboard on page load
    useEffect(() => {
        async function fetchLeads() {
            try{
                const response = await fetch("/api/leads");

                if (!response.ok){
                    throw new Error("Failed to fetch leads.");
                }

                const json = await response.json();
                
                // map json to the rows 
                const rows = json.data.rows;
                const leads: DBLeadRow[] = rows.map((row: DBLeadRow) => ({
                    lead_id: row.lead_id,
                    fname: row.fname,
                    lname: row.lname,
                    email: row.email,
                    company: row.company,
                    message: row.message,
                    source: row.source,
                    created_at: new Date(row.created_at),
                }));
                
                setData(leads);

                console.log("Received Data: ", data)

            } catch (err){
                console.error("Error loading leads:", err);
            }
            
        }

        fetchLeads();
    }, [])

    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <section className="mx-auto w-full max-w-6xl">
                {data ? 
                <DataTable columns={columns} data={data}/> 
                : null}
            </section>
        </main>
    );
}
