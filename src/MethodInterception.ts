/**
 * Represents an interception for a method.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
export type MethodInterception<T, TKey extends keyof T> = T[TKey] extends (...args: infer TArgs) => infer TResult ? (target: T, delegate: T[TKey], ...args: TArgs) => TResult : never;
