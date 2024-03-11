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
import { Ingredient } from "~/models/ingredient";
import { DeleteIngredientAlert } from "./delete-ingredient-alert";
import { useState } from "react";

export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Calories per gram",
  },
  {
    accessorKey: "calories",
    header: "Total Calories",
  },
  {
    accessorKey: "servingsSize",
    header: "Servings Size",
    cell: ({ row }) =>
      `${row.original.servingSize}${row.original.servingUnit[0]}`,
  },
  {
    accessorKey: "store",
    header: "Store",
    cell: ({ row }) => {
      return row.original.store ? row.original.store : "-";
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return row.original.brand ? row.original.brand : "-";
    },
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
                  className="cursor-pointer"
                  href={`/nutrition/ingredients/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={() => {
                  setShowDeleteAlert(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteIngredientAlert
            setOpen={setShowDeleteAlert}
            open={showDeleteAlert}
            id={row.original.id}
          />
        </>
      );
    },
  },
];
