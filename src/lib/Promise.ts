export type PromiseInstance<T = any> = typeof Promise<T> | any;

export type PromiseFunction<T = any> = (
	promises: PromiseInstance<T>[]
) => PromiseInstance<T[]>;
