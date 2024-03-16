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
  },
  {
    accessorKey: "totalWeight",
    header: "Total Quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
                  href={`/nutrition/ingredients/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-green-800 hover:bg-green-200 hover:text-destructive-foreground focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
                onClick={() => {
                  setShowDeleteAlert(true);
                }}
              >
                Mark Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <DeleteIngredientAlert
            setOpen={setShowDeleteAlert}
            open={showDeleteAlert}
            id={row.original.id}
          /> */}
        </>
      );
    },
  },
];
