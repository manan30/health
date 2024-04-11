import { BaseResponse } from '~/core/response';

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

export class Ingredient extends BaseResponse<IIngredient> {
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
		super();
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

	serialize() {
		return {
			id: this.id,
			name: this.name,
			calories: this.calories,
			servingSize: this.servingSize,
			servingUnit: this.servingUnit,
			store: this.store,
			brand: this.brand,
			macros: this.macros,
			createdAt: this.createdAt.toISOString(),
		};
	}
}
