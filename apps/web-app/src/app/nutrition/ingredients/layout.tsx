import React from "react";

export default async function IngredientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>layout{children}</div>;
}
