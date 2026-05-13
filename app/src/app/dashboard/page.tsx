'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import { getColumns, DBFullLeadRow } from "./columns";
import { DataTable } from "./data-table";


export default function Dashboard() {

    const [data, setData] = useState<DBFullLeadRow[]>([])

    // track the set of lead ids being analyzed
    const [analyzingLeadIds, setAnalyzingLeadIds] = useState<Set<string>>(new Set());
    const [isAnalyzingPending, setIsAnalyzingPending] = useState(false);

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

    // fetches analysis for specific lead
    // caches the function between renders unless the fetchLeads function changes, but thats also stable since it's useCallback function
    const handleAnalyzeLead = useCallback(async (leadId: string) => {
        setAnalyzingLeadIds((current) => new Set(current).add(leadId));
      
        try {
          const response = await fetch(`/api/analyze/${leadId}`, {
            method: "POST",
          });
      
          if (!response.ok) {
            throw new Error("Failed to analyze lead.");
          }
      
          await fetchLeads();
        } catch (err) {
          console.error("Error analyzing lead:", err);
        } finally {
          setAnalyzingLeadIds((current) => {
            const next = new Set(current);
            next.delete(leadId);
            return next;
          });
        }
    }, [fetchLeads]);
      
    // caches the columns array so it stays the same between renders until either function or state changes for analyzing leads 
    const tableColumns = useMemo(
        () =>
            getColumns({
                onAnalyzeLead: handleAnalyzeLead,
                analyzingLeadIds,
            }),
        [handleAnalyzeLead, analyzingLeadIds]
    );

    // fetches analysis data for leads
    async function handleAnalyze(){
        setIsAnalyzingPending(true);

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
        } finally {
            setIsAnalyzingPending(false);
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
                <DataTable
                    columns={tableColumns}
                    data={data}
                    onAnalyzePending={handleAnalyze}
                    isAnalyzingPending={isAnalyzingPending}
                /> 
                : null}
            </section>
        </main>
    );
}
