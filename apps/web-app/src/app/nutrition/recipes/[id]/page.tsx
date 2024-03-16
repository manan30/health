import { RecipeForm } from "./form";
import { NEW_ROUTE } from "~/app/utils/constants";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  let recipe = null;
  const isNew = params.id === NEW_ROUTE;

  // if (!isNew) {
  //   ingredient = await getIngredient(Number(params.id));
  // }

  return <RecipeForm isNew={isNew} recipe={recipe} />;
}
