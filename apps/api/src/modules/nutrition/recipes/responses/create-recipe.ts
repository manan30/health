import { RecipesSelectModel } from "db";
import { BaseModel } from "~/core/models";

type Recipe = { id: number };

export class CreateRecipeResponse extends BaseModel<Recipe> {
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
