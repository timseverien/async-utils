import { chunkList } from './list';

describe(chunkList.name, () => {
	test.each<[number]>([[-1], [0], [-Infinity]])(
		'given integer less than 0, throws',
		(chunkSize) => {
			const list = [1, 2, 3, 4];
			expect(() => chunkList(list, chunkSize)).toThrow(
				'Chunk size is too small'
			);
		}
	);

	test.each<[number]>([[0.5], [1.1], [Infinity], [NaN]])(
		'given non-integer, throws',
		(chunkSize) => {
			const list = [1, 2, 3, 4];
			expect(() => chunkList(list, chunkSize)).toThrow(
				'Chunk size is not a safe integer'
			);
		}
	);

	test.each<[any[], number, any[][]]>([
		[
			[1, 2, 3, 4],
			2,
			[
				[1, 2],
				[3, 4],
			],
		],
		[
			[1, 2, 3, 4, 5],
			3,
			[
				[1, 2, 3],
				[4, 5],
			],
		],
	])('given %j and %p, returns %j', (list, chunkSize, expectedResult) => {
		const result = chunkList(list, chunkSize);
		expect(result).toEqual(expectedResult);
	});
});
