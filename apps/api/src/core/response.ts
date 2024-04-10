export abstract class BaseResponse<T> {
	abstract serialize(): T;
}
