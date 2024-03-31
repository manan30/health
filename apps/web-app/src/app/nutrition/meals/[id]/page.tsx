import React from "react";
import { MealForm } from "./form";
import { NEW_ROUTE } from "~/app/utils/constants";

export default function MealPage({ params }: { params: { id: string } }) {
  const isNew = params.id === NEW_ROUTE;

  return <MealForm isNew={isNew} />;
}

export const dynamic = "force-dynamic";
