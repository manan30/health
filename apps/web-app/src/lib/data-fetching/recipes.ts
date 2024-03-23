import { ofetch as fetch } from "ofetch";
import { GetRecipeResponse, Recipe } from "~/models";
import { BASE_API_URL } from "./constants";

export enum ItemType {
  Recipe = "recipe",
  Ingredient = "ingredient",
}

export type CreateOrUpdateRecipeBody = {
  name: string;
  items: {
    id: number | null;
    quantity: number | null;
    type: ItemType;
  }[];
};

type SearchRecipe = {
  id: number;
  name: string;
  createdAt: string;
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

export async function createRecipe(body: CreateOrUpdateRecipeBody) {
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

export async function markCompleteRecipe(id: number) {
  return fetchInstance(`toggle-completion/${id}`, {
    method: "PUT",
  });
}

export async function getRecipeById(id: number) {
  return fetchInstance<GetRecipeResponse>(`/${id}`, {
    method: "GET",
  });
}

export async function updateRecipe(id: number, body: CreateOrUpdateRecipeBody) {
  return fetchInstance<Recipe>(`/${id}`, {
    body,
    method: "PUT",
  });
}

export async function searchRecipes(query: string = "") {
  return fetchInstance<SearchRecipe[]>(`/search?q=${query}`);
}
