"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ingredient } from "~/models/ingredient";

export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "calories",
    header: "Calories",
  },
  {
    accessorKey: "calsvg",
    header: "Cal/servings",
    cell: ({ row }) => {
      return Number(row.original.calories / row.original.servingSize).toFixed(
        2
      );
    },
  },
  {
    accessorKey: "servingsSize",
    header: "Servings Size",
    cell: ({ row }) =>
      `${row.original.servingSize} ${row.original.servingUnit}`,
  },
];
