import { PromiseFactory } from './lib/Promise';
import { assertPositiveInteger } from './lib/assert';

type EnqueuedTask<T> = {
	status: 'ENQUEUED';
	run: PromiseFactory<T>;
};

type RunningTask<T> = {
	status: 'RUNNING';
	promise: PromiseLike<T>;
};

type CompletedTask<T> = {
	status: 'COMPLETED';
	result: T;
};

type Task<T> = EnqueuedTask<T> | RunningTask<T> | CompletedTask<T>;

function getFirstEnqueuedTask<T>(tasks: Task<T>[]): EnqueuedTask<T> | null {
	return (
		tasks.find((t): t is EnqueuedTask<T> => t.status === 'ENQUEUED') ?? null
	);
}

function getCompletedTasks<T>(tasks: Task<T>[]): CompletedTask<T>[] {
	return tasks.filter((t): t is CompletedTask<T> => t.status === 'COMPLETED');
}

export async function throttleAll<T>(
	promiseFactories: PromiseFactory<T>[],
	poolSize: number
): Promise<T[]> {
	assertPositiveInteger(poolSize);

	const tasks: Task<T>[] = promiseFactories.map<EnqueuedTask<T>>(
		(promiseFactory) => ({
			status: 'ENQUEUED',
			run: promiseFactory,
		})
	);

	return new Promise<T[]>((resolve, reject) => {
		const runNext = async () => {
			const nextTask = getFirstEnqueuedTask(tasks);

			// No task found, so tasks are either running or done
			if (!nextTask) {
				const completedTasks = getCompletedTasks(tasks);

				// Some tasks are still running, so let’s wait for next call
				if (completedTasks.length !== promiseFactories.length) {
					return;
				}

				// All tasks are done, so we can resolve
				resolve(completedTasks.map((t) => t.result));
				return;
			}

			const index = tasks.indexOf(nextTask);
			const promise = nextTask.run();

			tasks[index] = {
				status: 'RUNNING',
				promise: promise,
			};

			try {
				const result = await promise;

				tasks[index] = {
					status: 'COMPLETED',
					result,
				};

				runNext();
			} catch (error) {
				reject(error);
			}
		};

		for (let i = 0; i < poolSize; i++) runNext();
	});
}
