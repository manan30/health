import Link from "next/link";
import React from "react";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";

export default function RootPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">
          Health and Fitness
        </h1>
        <p className="text-sm text-muted-foreground">
          My personal health and fitness tracker
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-4">
        <Link href="/nutrition/ingredients">
          <Card className="p-4 flex flex-col space-y-1.5 hover:bg-muted/50">
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Manage your ingredients</CardDescription>
          </Card>
        </Link>
        <Link href="/nutrition/recipes">
          <Card className="p-4 flex flex-col space-y-1.5 hover:bg-muted/50">
            <CardTitle>Recipes</CardTitle>
            <CardDescription>Manage your recipes</CardDescription>
          </Card>
        </Link>
      </div>
    </div>
  );
}
