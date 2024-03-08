import React from "react";
import { getIngredients } from "~/lib/data-fetching";
import { DataTable } from "./table";
import { columns } from "./columns";

export default async function IngredientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ingredients = await getIngredients();
  return <DataTable columns={columns} data={ingredients} />;
}
