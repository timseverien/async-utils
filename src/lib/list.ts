export function chunkList<T = any>(list: T[], chunkSize: number): T[][] {
	if (chunkSize <= 0) throw new Error('Chunk size is too small');
	if (!Number.isSafeInteger(chunkSize))
		throw new Error('Chunk size is not a safe integer');

	const chunks = [];

	for (let i = 0; i < list.length; i += chunkSize) {
		chunks.push(list.slice(i, i + chunkSize));
	}

	return chunks;
}
