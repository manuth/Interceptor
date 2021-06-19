/**
 * Provides the functionality to resolve a property.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
export type PropertyGetter<T, TKey extends keyof T> = IPropertyGetter<T, TKey>["Get"];

/**
 * Provides the functionality to resolve a property.
 */
interface IPropertyGetter<T, TKey extends keyof T>
{
    /**
     * Resolves the property with the specified {@link key `key`}.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property to get.
     *
     * @returns
     * The manipulated value.
     */
    Get(target: T, key: TKey): T[TKey];
}
