import { BaseResponse } from '~/core/response';

type SerializedCreateMealResponse = {
	id: number;
};

export class CreateMealResponse extends BaseResponse<SerializedCreateMealResponse> {
	id: number;

	constructor(values: { id: number }) {
		super();
		this.id = values.id;
	}

	serialize() {
		return {
			id: this.id,
		};
	}
}
