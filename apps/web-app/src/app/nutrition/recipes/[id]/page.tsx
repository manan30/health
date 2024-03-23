import { getRecipeById } from "~/lib/data-fetching/recipes";
import { RecipeForm } from "./form";
import { NEW_ROUTE } from "~/app/utils/constants";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  let recipe = null;
  const isNew = params.id === NEW_ROUTE;

  if (!isNew) {
    recipe = await getRecipeById(Number(params.id));
  }

  return <RecipeForm isNew={isNew} recipe={recipe ?? null} />;
}

export const dynamic = "force-dynamic";
