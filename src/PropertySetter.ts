/**
 * Provides the functionality to set a property.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
export type PropertySetter<T, TKey extends keyof T> = IPropertySetter<T, TKey>["Set"];

/**
 * Provides the functionality to set a property.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
interface IPropertySetter<T, TKey extends keyof T>
{
    /**
     * Sets the property with the specified {@link key `key`} of the {@link target `target`} to the specified {@link value `value`}.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property to set.
     *
     * @param value
     * The value to set.
     */
    Set(target: T, key: TKey, value: T[TKey]): void;
}
