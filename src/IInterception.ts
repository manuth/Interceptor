/**
 * Represents the interception of a property.
 */
export interface IInterception<T, TKey extends keyof T>
{
    /**
     * A method for determining whether a key exists.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property.
     *
     * @returns
     * A value indicating whether the key exists in the `target`.
     */
    Has?: (target: T, key: TKey) => boolean;

    /**
     * A method for resolving the property.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property.
     *
     * @returns
     * The manipulated value.
     */
    Get?: (target: T, key: TKey) => T[TKey];

    /**
     * A method for setting the property.
     *
     * @param target
     * The target this interception belongs to.
     *
     * @param key
     * The key of the property.
     *
     * @param value
     * The value to set.
     */
    Set?: (target: T, key: TKey, value: T[TKey]) => void;
}
