import { assertPositiveInteger } from './assert';

describe(assertPositiveInteger.name, () => {
	test.each([[-Infinity], [-1.5], [-1], [-0.5], [0], [1.5], [Infinity], [NaN]])(
		'given %p, throws',
		(value) =>
			expect(() => assertPositiveInteger(value)).toThrowError(
				`Number ${value} is not a positive integer`
			)
	);

	test('given invalid value and custom error message, throws passed error message', () => {
		const errorMessage = 'NOPE';

		expect(() => assertPositiveInteger(0, errorMessage)).toThrowError(
			errorMessage
		);
	});

	test.each([[1], [2], [3]])('given %p, does not throw', (value) => {
		expect(() => assertPositiveInteger(value)).not.toThrowError();
	});
});
