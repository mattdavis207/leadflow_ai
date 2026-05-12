'use client'

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function LeadPage(){

    const params = useParams();

    const id = params.id;

    useEffect(() => {
        async function fetchLeadFromId() {
            try{
                const response = await fetch(`/api/leads/${id}`)

                const data = await response.json();

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

        </main>
    );

}