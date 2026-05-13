"use client"

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DBFullLeadRow } from "@/app/dashboard/columns";
import Link from "next/link";
import { LeadAnalysisRow } from "@/lib/types";

export default function LeadPage(){

    const params = useParams();

    const id = params.id;

    const [lead, setLead] = useState<DBFullLeadRow>();

    const fetchLeadFromId = useCallback(async () => {
        if (!id) {
            return;
        }

        try{
            const response = await fetch(`/api/leads/${id}`)

            const result = await response.json();

            if (!response.ok){
                throw new Error("Failed to fetch lead data.");
            }

            const lead = result.data;
            
            setLead(lead);

            console.log("lead", lead);

        } catch (err){
            console.error("Error loading lead:", err);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeadFromId();
    }, [fetchLeadFromId])


    async function handleAnalyzeLead(){
        try{
            const response = await fetch(`/api/analyze/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok){
                throw new Error("Failed to analyze lead.");
            }

            const result = await response.json();
            console.log("Message: ", result.message);

            // Reload state with updated data
            await fetchLeadFromId();

        } catch (err){
            console.error("Error analyzing leads:", err);
        }
    }

    const urgencyClassName: Record<LeadAnalysisRow["urgency"], string> = {
        Low: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        High: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    }

    const sentimentClassName: Record<LeadAnalysisRow["sentiment"], string> = {
        Positive: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        Neutral: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
        Negative: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    }

    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="grid-cols-[auto_1fr_auto] gap-x-4">
                        <CardAction className="col-start-1 row-span-2 row-start-1 justify-self-start">
                            <Button asChild variant="outline" size="icon"> 
                                <Link href="/dashboard" aria-label="Back to dashboard">
                                    <IoMdArrowRoundBack />
                                </Link>
                            </Button>
                        </CardAction>
                        <CardTitle className="col-start-2 text-xl">
                            {lead ? `${lead.fname} ${lead.lname}` : "Lead Details"}
                        </CardTitle>
                        <CardDescription className="col-start-2">
                            {lead?.company ?? "Loading lead information..."}
                        </CardDescription>
                        {/* Analyze Button  */}
                        {lead?.analysis_status === "Pending" ? (
                            <CardAction className="col-start-3 row-span-2 row-start-1 self-center justify-self-end">
                                <Button
                                    className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800"
                                    size="sm"
                                    onClick={handleAnalyzeLead}
                                >
                                    Analyze Lead 
                                </Button>
                            </CardAction>
                        ): null}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {lead ? (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">
                                        Lead #{lead.lead_id}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {lead.source}
                                    </Badge>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-medium uppercase text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="mt-1 text-sm text-foreground">
                                            {lead.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-muted-foreground">
                                            Created
                                        </p>
                                        <p className="mt-1 text-sm text-foreground">
                                            {new Date(lead.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase text-muted-foreground">
                                        Message
                                    </p>
                                    <p className="mt-2 rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-foreground">
                                        {lead.message}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Loading...</p>
                        )}
                    </CardContent>
                </Card>

                {lead?.analysis_status === "Complete" ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                AI Analysis
                            </CardTitle>
                            <CardDescription>
                                Summary and recommended follow-up for this lead.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {lead.urgency ? (
                                    <Badge variant="secondary" className={urgencyClassName[lead.urgency]}>
                                        {lead.urgency}
                                    </Badge>
                                ): (
                                    <Badge variant="secondary">
                                        Unknown urgency
                                    </Badge>
                                )}
                                
                                <Badge variant="secondary">
                                    {lead.category}
                                </Badge>
                                {lead.sentiment ? (
                                    <Badge variant="secondary" className={sentimentClassName[lead.sentiment]}>
                                        {lead.sentiment}
                                    </Badge>
                                ): (
                                    <Badge variant="secondary">
                                        Unknown sentiment
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Summary
                                </p>
                                <p className="mt-2 text-sm leading-6 text-foreground">
                                    {lead.summary}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Suggested Reply
                                </p>
                                <p className="mt-2 rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-foreground">
                                    {lead.suggested_reply}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Next Action
                                </p>
                                <p className="mt-2 text-sm leading-6 text-foreground">
                                    {lead.next_action}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ): null}
            </div>
        </main>
    );

}
