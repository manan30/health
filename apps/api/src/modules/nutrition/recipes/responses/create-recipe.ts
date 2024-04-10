import { RecipesSelectModel } from "db";
import { BaseResponse } from "~/core/response";

type Recipe = { id: number };

export class CreateRecipeResponse extends BaseResponse<Recipe> {
	id: number;

	constructor(values: Recipe) {
		super();
		this.id = values.id;
	}

	serialize() {
		return {
			id: this.id,
		};
	}
}
