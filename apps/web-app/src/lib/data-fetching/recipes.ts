import { ofetch as fetch } from "ofetch";
import { Recipe } from "~/models";
import { BASE_API_URL } from "./constants";

export type CreateRecipeBody = {
  name: string;
  ingredients: {
    id: number | null;
    quantity: number | null;
  }[];
};

export const fetchInstance = fetch.create({
  baseURL: `${BASE_API_URL}/nutrition/recipes`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getAllRecipes() {
  return fetchInstance<Recipe[]>("");
}

export async function createRecipe(body: CreateRecipeBody) {
  return fetchInstance<Recipe>("", {
    body,
    method: "POST",
  });
}

export async function deleteRecipe(id: number) {
  return fetchInstance(`/${id}`, {
    method: "DELETE",
  });
}
