"use client"

import * as React from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { TbAnalyze } from "react-icons/tb";
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAnalyzePending?: () => Promise<void>,
  isAnalyzingPending?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAnalyzePending,
  isAnalyzingPending,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const[ filterColumn, setFilterColumn] = React.useState("email");
  const filterableColumns = ["fname", "lname", "email", "company", "source"];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    }
  })

  // helper function to clear filters on column change
  function changeFilterColumn(columnId: string){
    setColumnFilters([]);
    setFilterColumn(columnId);
  }

  return (
    <div className="w-full">
        <div className="flex items-center py-4">
            
            {/* Search Input for Filtering  */}
            <Input
            placeholder={`Filter ${filterColumn}...`}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className = "px-2">
                {/* Filter By Dropdown  */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Filter By
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => filterableColumns.includes(column.id))
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={filterColumn === column.id}
                            onCheckedChange={() => changeFilterColumn(column.id)}
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button
              variant="outline"
              className="rounded-full"
              disabled={isAnalyzingPending || !onAnalyzePending}
              onClick={onAnalyzePending}
            >
                {isAnalyzingPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TbAnalyze />
                )}
                {isAnalyzingPending ? "Analyzing..." : "Analyze All Pending Leads"}
            </Button>
                    
            {/* Column Visibility Dropdown  */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter(
                    (column) => column.getCanHide()
                )
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="overflow-x-auto rounded-md border bg-card">
            <Table className="min-w-[1100px]">
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
          <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                  Previous
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
              >
                  Next
              </Button>
          </div>
    </div>
  )
}
