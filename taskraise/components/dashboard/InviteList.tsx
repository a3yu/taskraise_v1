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

import { Database, Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogContent, AlertDialogHeader } from "../ui/alert-dialog";
import CreateOrganization from "./CreateOrganization";

export const columns: ColumnDef<Tables<"requests">>[] = [
  {
    accessorKey: "org_name",
    header: "Organization Name",
    cell: function Cell({ row }) {
      <div className="capitalize">{row.getValue("org_name")}</div>;
    },
  },
  {
    accessorKey: "inviter_name",
    header: "Invited By",
    cell: function Cell({ row }) {
      <div>{row.getValue("inviter_name")}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: function Cell({ row }) {
      const router = useRouter();
      const [open, setOpen] = useState(false);
      async function onClick() {
        const { data, error } = await supabase
          .from("profiles")
          .update({ organization: row.getValue("id") })
          .eq("id", row.original.user_invite);
        router.refresh();
      }
      return (
        <div className="text-right font-medium">
          <AlertDialog open={open}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <h2 className="text-lg font-semibold text-gray-900">
                  Are you sure you want to join this organization?
                </h2>
              </AlertDialogHeader>
              <AlertDialogDescription className="space-x-4 mt-4">
                <Button onClick={onClick}>Accept</Button>
                <Button variant={"secondary"} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </AlertDialogDescription>
            </AlertDialogContent>
            <Button onClick={() => setOpen(true)}>Accept</Button>
          </AlertDialog>
        </div>
      );
    },
  },
];

export function InviteList({ userData }: { userData: Tables<"profiles"> }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [createOrg, setCreateOrg] = useState(false);
  const [userID, setUserID] = useState("");
  const [data, setData] = useState<Tables<"requests">[]>([]);
  const router = useRouter();
  const fetchData = useCallback(async () => {
    try {
      if (userData) {
        setUserID(userData.id);
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .eq("user_invite", userData.id);
        setData(data as Tables<"requests">[]);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <AlertDialog open={createOrg}>
      <AlertDialogContent>
        <CreateOrganization user={userID} dialogState={setCreateOrg} />
      </AlertDialogContent>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search"
            value={
              (table.getColumn("org_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("org_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button
            variant={"outline"}
            className="ml-auto"
            onClick={() => {
              setCreateOrg(true);
            }}
          >
            Create New Organization
          </Button>
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
                    No invites found.
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
    </AlertDialog>
  );
}
