import Link from "next/link";
import React from "react";
import { buttonVariants } from "~/components/ui/button";

export default function MealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
            Meals
          </h1>
          <p className="text-sm text-muted-foreground">Manage your meals</p>
        </div>
        <Link className={buttonVariants()} href="/nutrition/meals/new">
          Add New Meal
        </Link>
      </div>
      <div className="px-6 pb-6 overflow-y-auto h-[calc(100%-6rem)]">
        {children}
        {/* <DataTable columns={columns} data={recipes} />
        {children} */}
      </div>
    </div>
  );
}
