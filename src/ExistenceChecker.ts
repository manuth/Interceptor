/**
 * Provides the functionality to check whether a key exists in an object.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
export type ExistenceChecker<T, TKey> =
    /**
     * Checks whether the specified {@link key `key`} exists.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property.
     *
     * @returns
     * A value indicating whether the specified {@link key `key`} exists in the {@link target `target`}.
     */
    (target: T, key: TKey) => boolean;
