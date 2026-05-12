'use client'

import { useEffect, useState } from "react";
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

import { DBLeadRow } from "@/app/dashboard/columns";
import Link from "next/link";

export default function LeadPage(){

    const params = useParams();

    const id = params.id;

    const [lead, setLead] = useState<DBLeadRow>();

    useEffect(() => {
        async function fetchLeadFromId() {
            try{
                const response = await fetch(`/api/leads/${id}`)

                const result = await response.json();

                const lead = result.data;
                
                setLead(lead);

                console.log("lead", lead);

                if (!response.ok){
                    throw new Error("Failed to fetch lead data.");
                }

            } catch (err){
                console.error("Error loading lead:", err);
            }
        }

        if (id){
            fetchLeadFromId();
        }

    }, [id])



    return (
        <main className="min-h-screen bg-background px-6 py-12">
            <Card className="mx-auto max-w-3xl">
                <CardHeader className="grid-cols-[auto_1fr] gap-x-4">
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
        </main>
    );

}
