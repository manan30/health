import { NEW_ROUTE } from "./constants";
import { IngredientForm } from "./form";

export default function IngredientPage({ params }: { params: { id: string } }) {
  const isNew = params.id === NEW_ROUTE;

  return (
    <>
      <IngredientForm isNew={isNew} />
    </>
  );
}
