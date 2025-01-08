export class AssertionError extends Error {}

export function assert(value: unknown, error: string | Error): asserts value {
  if (value === false) {
    throw error instanceof Error ? error : new AssertionError(error);
  }
}