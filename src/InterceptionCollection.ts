import { IInterception } from "./IInterception";

/**
 * Represents a collection of interceptions.
 */
export class InterceptionCollection<T extends Record<string | number | symbol, unknown>> extends Map<keyof T, IInterception<T, keyof T>>
{
    /**
     * Gets an interception of the collection.
     *
     * @param key
     * The key whose value to get.
     *
     * @returns
     * The interception with the specified key.
     */
    public override get<TKey extends keyof T>(key: TKey): IInterception<T, TKey>
    {
        return super.get(key as keyof T) as IInterception<T, TKey>;
    }

    /**
     * Sets an interception of the collection.
     *
     * @param key
     * The key whose value to set.
     *
     * @param value
     * The value to set.
     *
     * @returns
     * This collection.
     */
    public override set<TKey extends keyof T>(key: TKey, value: IInterception<T, TKey>): this
    {
        return super.set(key, value);
    }
}
