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

  return (
    <RecipeForm
      isNew={isNew}
      recipe={
        recipe
          ? {
              id: recipe?.id,
              name: recipe?.name,
              recipeIngredients: recipe?.recipeIngredients.map((ri) => ({
                ingredientId: ri.ingredientId,
                quantity: ri.quantity,
              })),
            }
          : null
      }
    />
  );
}

export const dynamic = "force-dynamic";
