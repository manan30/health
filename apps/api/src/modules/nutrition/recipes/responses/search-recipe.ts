import { RecipesSelectModel } from "db";
import { BaseResponse } from "~/core/response";

type Response = {
  id: number;
  name: string;
  createdAt: Date;
};

export class SearchRecipesResponse extends BaseResponse<Response> {
  id: number;
  name: string;
  createdAt: Date;

  constructor(values: RecipesSelectModel) {
    super();
    this.id = values.id;
    this.name = values.name;
    this.createdAt = new Date(values.createdAt);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
    };
  }
}
