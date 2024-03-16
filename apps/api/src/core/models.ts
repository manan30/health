export abstract class BaseModel<T> {
  abstract serialize(): T;
}
