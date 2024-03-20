"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Recipe } from "~/models";
import { useState } from "react";
import { DeleteRecipeAlert } from "./delete-recipe-alert";
import { ToggleCompletionRecipeAlert } from "./toggle-completion-recipe-alert";
import { cn } from "~/lib/utils";

export const columns: ColumnDef<Recipe>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Unit Calories",
    cell: ({ row }) => {
      return (
        Number(row.original.totalCalories) / Number(row.original.totalWeight)
      ).toFixed(2);
    },
  },
  {
    accessorKey: "totalCalories",
    header: "Total Calories",
    cell: ({ row }) => Math.ceil(Number(row.original.totalCalories)),
  },
  {
    accessorKey: "totalWeight",
    header: "Total Quantity",
    cell: ({ row }) => Math.ceil(Number(row.original.totalWeight)),
  },
  {
    accessorKey: "completed",
    header: "Complete",
    cell: ({ row }) => (
      <span
        className={cn(
          "text-xs px-2 py-1 rounded-md",
          row.original.completed
            ? "bg-green-100 text-green-800"
            : "bg-secondary text-primary"
        )}
      >
        {row.original.completed ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created date",
    cell: ({ row }) =>
      Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.original.createdAt)),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteAlert, setShowDeleteAlert] = useState(false);
      const [showToggleCompletionAlert, setShowToggleCompletionAlert] =
        useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  className="cursor-pointer text-xs"
                  href={`/nutrition/recipes/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer text-xs",
                  !row.original.completed &&
                    "text-green-800 focus:bg-green-100 focus:text-green-800"
                )}
                onClick={() => {
                  setShowToggleCompletionAlert(true);
                }}
              >
                {row.original.completed ? "Mark In Progress" : "Mark Completed"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
                onClick={() => {
                  setShowDeleteAlert(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteRecipeAlert
            setOpen={setShowDeleteAlert}
            open={showDeleteAlert}
            id={row.original.id}
          />
          <ToggleCompletionRecipeAlert
            setOpen={setShowToggleCompletionAlert}
            open={showToggleCompletionAlert}
            id={row.original.id}
            isComplete={row.original.completed}
          />
        </>
      );
    },
  },
];
