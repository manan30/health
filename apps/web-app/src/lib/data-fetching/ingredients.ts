import { ofetch as fetch } from "ofetch";
import { BASE_API_URL } from "./constants";

export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  store: string | null;
  brand: string | null;
  macros: {
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
  } | null;
  createdAt: Date;
}

export interface CreateIngredientBody {
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  store?: string;
  brand?: string;
  protein?: number;
  fat?: number;
  carbs?: number;
  fiber?: number;
  sugar?: number;
}

export const fetchInstance = fetch.create({
  baseURL: `${BASE_API_URL}/nutrition/ingredients`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createIngredient(data: CreateIngredientBody) {
  return fetchInstance<Ingredient>("", {
    body: data,
    method: "POST",
  });
}

export async function getAllIngredients() {
  return fetchInstance<Ingredient[]>("");
}

export async function getIngredient(id: number) {
  return fetchInstance<Ingredient>(`/${id}`);
}

export async function updateIngredient(id: number, data: CreateIngredientBody) {
  return fetchInstance<Ingredient>(`/${id}`, {
    body: data,
    method: "PUT",
  });
}

export async function deleteIngredient(id: number) {
  return fetchInstance(`/${id}`, {
    method: "DELETE",
  });
}
