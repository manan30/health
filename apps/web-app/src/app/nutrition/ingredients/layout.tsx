import React from "react";
import { DataTable } from "./table";
import { columns } from "./columns";
import { getAllIngredients } from "~/lib/data-fetching/ingredients";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function IngredientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ingredients = await getAllIngredients();
  return (
    <>
      <div className="flex flex-col overflow-hidden h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4">
          <div className="flex flex-col space-y-1.5">
            <h1 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
              Ingredients
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your ingredients
            </p>
          </div>
          <Link className={buttonVariants()} href="/nutrition/ingredients/new">
            Add New Ingredient
          </Link>
        </div>
        <div className="px-6 pb-6 overflow-y-auto h-[calc(100%-6rem)]">
          <DataTable columns={columns} data={ingredients} />
          {children}
        </div>
      </div>
    </>
  );
}
