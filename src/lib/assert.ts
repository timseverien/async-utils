export function assertPositiveInteger(n: number, errorMessage?: string) {
	if (Number.isSafeInteger(n) && n > 0) return;
	throw new Error(errorMessage ?? `Number ${n} is not a positive integer`);
}
