import React from "react";
import { DataTable } from "./table";
import { columns } from "./columns";
import { getAllIngredients } from "~/lib/data-fetching/ingredients";

export default async function IngredientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ingredients = await getAllIngredients();
  return (
    <>
      <DataTable columns={columns} data={ingredients} />
      {children}
    </>
  );
}
