export interface CreateIngredient {
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
