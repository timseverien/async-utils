import { batchAll } from './batch';

// How many milliseconds we allow to be between items within the same batch
const PROMISE_FACTORY_CALL_DELAY_TOLERANCE_MS = 20;

function sleep(duration: number) {
	return new Promise<void>((resolve) => {
		setTimeout(() => resolve(), duration);
	});
}

describe(batchAll.name, () => {
	test.each<[number]>([
		[-Infinity],
		[-1.5],
		[-1],
		[0],
		[1.5],
		[Infinity],
		[NaN],
	])('given batch size %p, throws', async (batchSize) => {
		const promiseFactories = [
			() => Promise.resolve(1),
			() => Promise.resolve(2),
			() => Promise.resolve(3),
		];

		await expect(() => batchAll(promiseFactories, batchSize)).rejects.toThrow(
			'not a positive integer'
		);
	});

	test('given Promise factories and batch size, returns the resolve values in order', async () => {
		const batchSize = 2;
		const promiseFactories = [
			() => Promise.resolve(1),
			() => Promise.resolve(2),
			() => Promise.resolve(3),
			() => Promise.resolve(4),
		];

		const result = await batchAll(promiseFactories, batchSize);

		expect(result).toEqual([1, 2, 3, 4]);
	});

	test('given Promise factories and batch size, executes promises in a batched fashion', async () => {
		const mockCallbackImplementation = (d: Date) => {};
		const mockCallback1 = jest.fn(mockCallbackImplementation);
		const mockCallback2 = jest.fn(mockCallbackImplementation);
		const mockCallback3 = jest.fn(mockCallbackImplementation);

		const batchSize = 2;
		const promiseFactories = [
			() => {
				mockCallback1(new Date());
				return Promise.resolve(1);
			},
			async () => {
				mockCallback2(new Date());
				await sleep(1000);
				return 2;
			},
			() => {
				mockCallback3(new Date());
				return Promise.resolve(3);
			},
		];

		await batchAll(promiseFactories, batchSize);

		// Factory calls within the first batch should have no perceivable delay between them.
		expect(
			mockCallback2.mock.calls[0][0].getTime() -
				mockCallback1.mock.calls[0][0].getTime()
		).toBeLessThan(PROMISE_FACTORY_CALL_DELAY_TOLERANCE_MS);

		// In our first batch, we have a delay of 1000ms. We expect the second batch to be called after
		// the first batch was resolved, there should be at least 1000ms delay between calls in the
		// first and second batch.
		expect(
			mockCallback3.mock.calls[0][0].getTime() -
				mockCallback1.mock.calls[0][0].getTime()
		).toBeGreaterThanOrEqual(1000);
	});
});
