import { ofetch as fetch } from "ofetch";
import { GetRecipeResponse, Recipe } from "~/models";
import { BASE_API_URL } from "./constants";

export type CreateRecipeBody = {
  name: string;
  ingredients: {
    id: number | null;
    quantity: number | null;
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

export async function updateRecipe(id: number, body: CreateRecipeBody) {
  return fetchInstance<Recipe>(`/${id}`, {
    body,
    method: "PUT",
  });
}

export async function searchRecipes(query: string = "") {
  return fetchInstance<SearchRecipe[]>(`/search?q=${query}`);
}
