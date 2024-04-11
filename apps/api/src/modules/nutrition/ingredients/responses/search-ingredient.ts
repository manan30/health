import { BaseResponse } from '~/core/response';

interface Response {
	id: number;
	name: string;
	store: string | null;
	brand: string | null;
}

export class SearchIngredientsResponse extends BaseResponse<Response> {
	id: number;
	name: string;
	store: string | null;
	brand: string | null;

	constructor(values: Response) {
		super();
		this.id = values.id;
		this.name = values.name;
		this.store = values.store;
		this.brand = values.brand;
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			store: this.store,
			brand: this.brand,
		};
	}
}
