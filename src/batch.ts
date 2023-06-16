import { PromiseFactory } from './lib/Promise';
import { chunkList } from './lib/list';

export async function batchAll<T>(
	promiseFactories: PromiseFactory<T>[],
	batchSize: number
): Promise<T[]> {
	const chunks = chunkList<PromiseFactory<T>>(promiseFactories, batchSize);
	const values = [];

	for (const chunk of chunks) {
		const chunkValues = await Promise.all(chunk.map((c) => c()));
		values.push(...chunkValues);
	}

	return values;
}
