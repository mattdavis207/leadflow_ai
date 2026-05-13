

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import type { LeadAnalysisRow } from "@/lib/types"

export type DBFullLeadRow = {
    lead_id: string,
    fname: string,
    lname: string,
    email: string,
    company: string,
    message: string,
    source: string,
    created_at: string,
    analysis_status: "Pending" | "Complete" | "Failed",
    summary: string | null,
    category: string | null,
    urgency: LeadAnalysisRow["urgency"] | null,
    sentiment: LeadAnalysisRow["sentiment"] | null,
    suggested_reply: string | null,
    next_action: string | null,
}

export const columns: ColumnDef<DBFullLeadRow>[] = [
    // View Lead Link 
    {
        id: "view",
        cell: ({row}) => {
            const lead = row.original 

            return (
                <Link
                    className="font-medium text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline"
                    href={`/leads/${lead.lead_id}`}
                >
                    View lead
                </Link>
            );
        }
    },
    // rest of the columns
    {
        accessorKey: "lead_id",
        header: "Lead"
    },
    {
        accessorKey: "fname",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              First Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "lname",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Last Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "company",
        header: "Company"
    },
    {
        accessorKey: "message",
        header: "Message"
    },
    {
        accessorKey: "source",
        header: "Source"
    },
    {
        accessorKey: "created_at",
        header: "Created At"
    },
    {
      accessorKey: "summary",
      header: "Summary"
    },
    {
      accessorKey: "category",
      header: "Category"
    },
    {
      accessorKey: "urgency",
      header: "Urgency",
      cell: ({ row }) => {
        const urgency = row.getValue("urgency") as DBFullLeadRow["urgency"]

        const urgencyClassName: Record<LeadAnalysisRow["urgency"], string> = {
          Low: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
          Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
          High: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        }

        return urgency ? (
          <Badge className={urgencyClassName[urgency]}>
            {urgency}
          </Badge>
        ) : (
          <Badge variant="secondary">Pending</Badge>
        )
      }
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => {
        const sentiment = row.getValue("sentiment") as DBFullLeadRow["sentiment"]

        const sentimentClassName: Record<LeadAnalysisRow["sentiment"], string> = {
          Positive: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
          Neutral: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
          Negative: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        }

        return sentiment ? (
          <Badge className={sentimentClassName[sentiment]}>
            {sentiment}
          </Badge>
        ) : (
          <Badge variant="secondary">Pending</Badge>
        )
      }
    },
    {
      accessorKey: "suggested_reply",
      header: "Suggest Reply"
    },
    {
      accessorKey: "next_action",
      header: "Next Action"
    },
    {
        accessorKey: "analysis_status",
        header: "Analysis Status",
        cell: ({ row }) => {
          const analysis_status = row.getValue(
            "analysis_status"
          ) as DBFullLeadRow["analysis_status"]

          // conditional rendering based on value of analysis status, simple object key value pairs
          const statusClassName: Record<DBFullLeadRow["analysis_status"], string> = {
            Pending: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
            Complete: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
            Failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
          }

          return (
            <Badge className={statusClassName[analysis_status]}>
                {analysis_status}
            </Badge>

          );
        }
    },
    // action dropdown menu
    {
        id: "actions",
        cell: ({ row }) => {
          const lead = row.original
            
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {/* <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(lead.id)}
                >
                  Copy lead ID
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>   
                    <Link href={`/leads/${lead.lead_id}`}>
                        View lead
                    </Link>
                </DropdownMenuItem>
               
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
]
