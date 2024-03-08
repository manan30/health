export interface IIngredient {
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
  createdAt: string;
}

export class Ingredient {
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

  constructor(values: IIngredient) {
    this.id = values.id;
    this.name = values.name;
    this.calories = values.calories;
    this.servingSize = values.servingSize;
    this.servingUnit = values.servingUnit;
    this.store = values.store;
    this.brand = values.brand;
    this.macros = values.macros;
    this.createdAt = new Date(values.createdAt);
  }
}
