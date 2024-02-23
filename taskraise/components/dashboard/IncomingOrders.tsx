"use client";
import * as React from "react";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptOrder, rejectOrder } from "@/lib/server/orderActions";
import { orderQuery } from "@/lib/queryTypes";

export const columns: ColumnDef<orderQuery & { username: string }>[] = [
  {
    accessorKey: "username",
    header: () => <div className="">Customer</div>,
    cell: function Cell({ row }) {
      return (
        <div className="lowercase font-bold">{row.getValue("username")}</div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="">Price</div>,
    cell: function Cell({ row }) {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className=" font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="">Submitted</div>,
    cell: function Cell({ row }) {
      const a = new Date(row.getValue("created_at"));
      console.log(row.getValue("created_at"));
      return <div className=" font-medium">{a.toDateString()}</div>;
    },
  },
  {
    accessorKey: "order_details",
    header: () => <div className=""></div>,
    cell: function Cell({ row }) {
      const [show, setShow] = React.useState(false);
      const date = new Date(
        row.original.created_at ? row.original.created_at : 0
      );
      const router = useRouter();
      async function onAccept() {
        await acceptOrder(row.original.id);
        setOpenAccept(false);
        setShow(false);
      }
      async function onReject() {
        await rejectOrder(row.original.id);
        setOpenReject(false);
        setShow(false);
      }
      const [openAccept, setOpenAccept] = React.useState(false);
      const [openReject, setOpenReject] = React.useState(false);
      return (
        <div className="float-right">
          <Dialog open={show} onOpenChange={setShow}>
            <Button
              onClick={() => {
                setShow(true);
              }}
            >
              Details
            </Button>
            <DialogContent className="w-full">
              <DialogHeader>
                <h1 className="font-bold text-2xl">Order Information</h1>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <h2 className="font-semibold">Order Time</h2>
                  {date.toUTCString()}
                </div>
                <div>
                  <h2 className="font-semibold">Order Details</h2>
                  {row.getValue("order_details")}
                </div>
              </div>
              <DialogFooter className="mt-2">
                <div className="mr-auto space-x-3">
                  <Dialog open={openAccept} onOpenChange={setOpenAccept}>
                    <DialogContent>
                      <DialogHeader>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Are you sure you want to accept this order?
                        </h2>
                      </DialogHeader>
                      <DialogDescription className="space-x-4 mt-4">
                        <Button
                          onClick={onAccept}
                          className="hover:bg-green-400 bg-green-500"
                        >
                          Accept
                        </Button>
                        <Button
                          variant={"secondary"}
                          onClick={() => setOpenAccept(false)}
                        >
                          Cancel
                        </Button>
                      </DialogDescription>
                    </DialogContent>
                    <Button
                      onClick={() => setOpenAccept(true)}
                      className="hover:bg-green-400 bg-green-500"
                    >
                      Accept
                    </Button>
                  </Dialog>
                  <Dialog open={openReject} onOpenChange={setOpenReject}>
                    <DialogContent>
                      <DialogHeader>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Are you sure you want to reject this order?
                        </h2>
                      </DialogHeader>
                      <DialogDescription className="space-x-4 mt-4">
                        <Button
                          onClick={onReject}
                          className="hover:bg-red-400 bg-red-500"
                        >
                          Reject
                        </Button>
                        <Button
                          variant={"secondary"}
                          onClick={() => setOpenReject(false)}
                        >
                          Cancel
                        </Button>
                      </DialogDescription>
                    </DialogContent>
                    <Button
                      onClick={() => setOpenReject(true)}
                      className="hover:bg-red-400 bg-red-500"
                    >
                      Reject
                    </Button>
                  </Dialog>
                </div>
                <div className="float-right">
                  <Button onClick={() => setShow(false)}>Close</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

export function IncomingOrders({
  orgOrders,
}: {
  orgOrders: (orderQuery & { username: string })[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] =
    React.useState<(orderQuery & { username: string })[]>(orgOrders);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Customer Search"
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
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
                  );
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
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
    </div>
  );
}
