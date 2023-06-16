import { assertPositiveInteger } from './assert';

export function chunkList<T = any>(list: T[], chunkSize: number): T[][] {
	assertPositiveInteger(chunkSize);

	const chunks = [];

	for (let i = 0; i < list.length; i += chunkSize) {
		chunks.push(list.slice(i, i + chunkSize));
	}

	return chunks;
}
