export interface Api<T> {
  get(uuid: string): T | undefined;
  getAll(): T[];
  create(data: T): void;
  update(data: T): void;
  delete(uuid: string): void;
}
