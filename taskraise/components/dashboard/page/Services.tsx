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
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { CreateService } from "@/components/dashboard/CreateService";
import Image from "next/image";
import { ChangeService } from "@/components/dashboard/ChangeService";
import { AlertDescription } from "@/components/ui/alert";
import { deleteService } from "@/lib/server/serviceActions";

export const columns: ColumnDef<Tables<"services">>[] = [
  {
    accessorKey: "thumbnail_path",
    header: () => <div className=""></div>,
    cell: function Cell({ row }) {
      const [thumbnail, setThumbnail] = useState("");
      useEffect(() => {
        async function downloadImage(path: string) {
          try {
            const { data, error } = await supabase.storage
              .from("thumbnails")
              .download(path);
            if (error) {
              throw error;
            }

            const url = URL.createObjectURL(data);
            setThumbnail(url);
          } catch (error) {
            console.log("Error downloading image: ", error);
          }
        }
        downloadImage(row.getValue("thumbnail_path"));
      }, [supabase]);

      return (
        <div className="w-[100px] h-[56.25px] relative">
          {" "}
          <Image
            src={thumbnail}
            layout="fill"
            alt="thumbnail"
            className="rounded"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "service_title",
    header: () => <div className="">Title</div>,
    cell: function Cell({ row }) {
      return (
        <div className="font-bold text-md">{row.getValue("service_title")}</div>
      );
    },
  },
  {
    accessorKey: "location_text",
    header: () => <div className="">Delivery Method/Location</div>,
    cell: function Cell({ row }) {
      if (row.getValue("location_text")) {
        return <div>{row.getValue("location_text")}</div>;
      } else {
        return <div>REMOTE</div>;
      }
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
    accessorKey: "details",
    header: () => <div className=""></div>,
    cell: function Cell({ row }) {
      const [showDetails, setShowDetails] = React.useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const [showChange, setShowChange] = useState(false);
      const [uploading, setUploading] = useState(false);
      const [file, setFile] = useState<File | null>(null);
      const [filePath, setFilePath] = useState("");
      const [uid, setUid] = useState("");
      const [showPreview, setShowPreview] = useState(false);
      const [preview, setPreview] = useState<string | null>(null);
      const router = useRouter();
      const uploadThumbnail: React.ChangeEventHandler<
        HTMLInputElement
      > = async (event) => {
        try {
          setUploading(true);
          const user = await (await supabase.auth.getUser()).data.user;
          if (user) {
            if (!event.target.files || event.target.files.length === 0) {
              throw new Error("You must select an image to upload.");
            }
            setFile(event.target.files[0]);
            setUid(user.id);
          }
        } catch (error) {
          alert("Error uploading thumbnail!");
        }
      };
      async function onSubmit() {
        if (file) {
          let { error: uploadError } = await supabase.storage
            .from("thumbnails")
            .upload(filePath, file);
          const deleteThumb = row.original.thumbnail_path;
          const { error } = await supabase.storage
            .from("thumbnails")
            .remove([deleteThumb]);
          if (!error && filePath != "") {
            const update = await supabase
              .from("services")
              .update({ thumbnail_path: filePath })
              .eq("id", row.original.id);
          }

          if (uploadError) {
            throw uploadError;
          }
        } else {
        }
      }
      useEffect(() => {
        try {
          const fileExt = file?.name.split(".").pop();
          setFilePath(`${uid}-${Math.random()}.${fileExt}`);
          if (file) {
            setPreview(URL.createObjectURL(file));
            setShowPreview(true);
          }
        } catch (error) {
          alert("Error uploading thumbnail!");
        } finally {
          setUploading(false);
        }
      }, [file]);
      return (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="my-auto">
                Service Info
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                }}
              >
                Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowChange(true);
                }}
              >
                Change Thumbnail
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setShowDelete(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={showDetails}>
            <AlertDialogContent className="">
              <AlertDialogHeader>
                <h1 className="font-bold text-2xl">Service Information</h1>
              </AlertDialogHeader>
              <ChangeService dialogState={setShowDetails} rowService={row} />
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={showDelete}>
            <AlertDialogContent className="">
              <AlertDialogHeader>
                <h1 className="font-bold text-2xl">Are you sure?</h1>
              </AlertDialogHeader>
              <AlertDescription>This cannot be undone.</AlertDescription>
              <div className="w-full">
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  onClick={async () => {
                    await deleteService(row.original.id);
                  }}
                >
                  Confirm
                </Button>{" "}
                <Button
                  className="float-right"
                  onClick={() => {
                    setShowDelete(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={showChange}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <h1 className="font-bold text-2xl">Change Thumbnail</h1>
              </AlertDialogHeader>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={uploadThumbnail}
              />
              {preview && (
                <>
                  <div className="w-72 h-40 relative mx-auto ">
                    <Image
                      src={preview}
                      alt={""}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                </>
              )}
              <AlertDialogFooter>
                {preview && (
                  <Button className="mr-auto" onClick={onSubmit}>
                    Submit
                  </Button>
                )}
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => {
                    setFilePath("");
                    setFile(null);
                    setShowChange(false);
                    setPreview(null);
                  }}
                >
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default function Services({
  services,
}: {
  services: Tables<"services">[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = useState(false);
  const [dataFetch, setData] = useState<Tables<"profiles"> | null>(null);
  const [data, setServices] = useState<Tables<"services">[]>(services);

  const router = useRouter();

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
    <div className="w-full px-16 py-7">
      <h1 className="font-heading text-4xl">Services</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Service Search"
          value={
            (table.getColumn("service_title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("service_title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto space-x-3">
          <AlertDialog open={show}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <h2 className="font-heading font-semibold text-2xl">
                  Create New Service
                </h2>
              </AlertDialogHeader>
              <CreateService
                submitted={setSubmitted}
                dialogState={setShow}
                orgId={
                  dataFetch?.organization
                    ? dataFetch.organization.toString()
                    : ""
                }
              />
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={() => {
              setShow(true);
            }}
          >
            Create New Service
          </Button>
        </div>
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
