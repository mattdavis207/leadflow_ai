

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export type DBLeadRow = {
    lead_id: number,
    fname: string,
    lname: string,
    email: string,
    company: string,
    message: string,
    source: string,
    created_at: string
}

export const columns: ColumnDef<DBLeadRow>[] = [
    // View Lead Link 
    {
        id: "view",
        cell: ({row}) => {
            const lead = row.original 

            return (
                <Link href={`/leads/${lead.lead_id}`}>
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
        header: "First Name"
    },
    {
        accessorKey: "lname",
        header: "Last Name"
    },
    {
        accessorKey: "email",
        header: "Email"
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


