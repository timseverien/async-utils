import { PromiseInstance } from './lib/Promise';
import { chunkList } from './lib/list';

export async function batchAll<T>(
	promises: PromiseInstance<T>[],
	batchSize: number
): Promise<T[]> {
	const chunks = chunkList<T>(promises, batchSize);
	const values: T[] = [];

	for (const chunk of chunks) {
		const chunkValues = await Promise.all(chunk);
		values.push(...chunkValues);
	}

	return values;
}
