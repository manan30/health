import { ofetch as fetch } from "ofetch";

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
  baseURL: "http://localhost:8787/v1/nutrition/ingredients",
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
