import { ofetch as fetch } from "ofetch";
import { Recipe } from "~/models";
import { BASE_API_URL } from "./constants";

export const fetchInstance = fetch.create({
  baseURL: `${BASE_API_URL}/nutrition/recipes`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getAllRecipes() {
  return fetchInstance<Recipe[]>("");
}
