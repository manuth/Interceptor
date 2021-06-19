import { ExistenceChecker } from "./ExistenceChecker";
import { PropertyGetter } from "./PropertyGetter";

/**
 * Represents the interception of a property.
 *
 * @template T
 * The type of the target of the interception.
 *
 * @template TKey
 * The key of the intercepted member.
 */
export interface IInterception<T, TKey extends keyof T>
{
    /**
     * A function for determining whether the specified key exists.
     */
    Has?: ExistenceChecker<T, TKey>;

    /**
     * A function for resolving the property.
     */
    Get?: PropertyGetter<T, TKey>;

    /**
     * A function for setting the property.
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
