import { getIngredient } from "~/lib/data-fetching/ingredients";
import { IngredientForm } from "./form";
import { NEW_ROUTE } from "~/app/utils/constants";

export default async function IngredientPage({
  params,
}: {
  params: { id: string };
}) {
  let ingredient = null;
  const isNew = params.id === NEW_ROUTE;

  if (!isNew) {
    ingredient = await getIngredient(Number(params.id));
  }

  return <IngredientForm isNew={isNew} ingredient={ingredient} />;
}
