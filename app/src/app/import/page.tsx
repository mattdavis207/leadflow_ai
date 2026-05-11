"use client"

import Papa from 'papaparse';
import { useState } from 'react';
import type { LeadRow } from '@/lib/types';

export default function ImportPage() {

    const [csvString, setCsvString] = useState("");
    const [headers, setHeaders] = useState<string[]>([]);

    const [parsedData, setParsedData] = useState<LeadRow[]>([]);


    const handleImport = async () => {
        try {
            const response = await fetch("/api/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Message: ', result.message, '\nSuccess: ', result.success, '\nTotal rows imported: ', result.importedCount);

        } catch (err){
            console.error('Error:', err);
        }
    }

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        // getting first file of event object
        const file = e.target.files?.[0]; 

        // get string of csv from the file
        if (file){
            const reader = new FileReader();
            
            // define callback for everytime file is read
            reader.onload = (e) => {
                const text = e.target?.result;
                console.log("text", text);

                // confirm type before setting
                if (typeof text === "string" ){
                    setCsvString(text);
                    const data = Papa.parse<LeadRow>(text, {header: true, delimiter: ','});
                    setParsedData(data.data);
                    setHeaders(data.meta.fields ?? []);
                    console.log("data: ", data);
                }
            }

            reader.readAsText(file);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
            <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
                {/* Import file input  */}
                <label className="flex flex-col gap-3">
                    <span className="text-sm font-medium text-zinc-900">
                        Import CSV File
                    </span>
                    <span className="text-sm text-zinc-500">
                        Upload a lead list with name, email, company, message, and source columns.
                    </span>
                <input
                    className="block w-full cursor-pointer rounded-md border border-zinc-300 bg-white text-sm text-zinc-700 file:mr-4 file:border-0 file:bg-zinc-900 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                    type="file"
                    accept=".csv" 
                    name="Import CSV File"
                    onChange={handleCSVUpload}
                />
                    {csvString ? (
                        <span className="text-sm text-emerald-700">
                            CSV loaded and parsed.
                        </span>
                    ) : null}
                </label>
                    {/* Headers display list  */}
                    {headers.length > 0 ? (
                        <div className="mt-6 border-t border-zinc-200 pt-5">
                            <h2 className="text-sm font-medium text-zinc-900">
                                Headers Detected
                            </h2>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {headers.map((header) => (
                                    <li
                                        className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm text-zinc-700"
                                        key={header}
                                    >
                                        {header}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* Import Button  */}
                    {csvString ? (
                        <div className="mt-6 border-t border-zinc-200 pt-5">
                            <button
                                className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:bg-emerald-800"
                                type="button"
                                onClick={handleImport}
                            >
                                Import Data
                            </button>
                        </div>
                    ): null }
            </section>
        </main>
    );
}
