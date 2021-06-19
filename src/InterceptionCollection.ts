import { IInterception } from "./IInterception";

/**
 * Represents a collection of interceptions.
 *
 * @template T
 * The type of the target of the interceptions.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class InterceptionCollection<T extends {}> extends Map<keyof T, IInterception<T, keyof T>>
{
    /**
     * Gets an interception of the collection.
     *
     * @param key
     * The key whose interception to get.
     *
     * @returns
     * The interception with the specified {@link key `key`}.
     */
    public override get<TKey extends keyof T>(key: TKey): IInterception<T, TKey>
    {
        return super.get(key as keyof T) as IInterception<T, TKey>;
    }

    /**
     * Sets an interception of the collection.
     *
     * @param key
     * The key whose interception to set.
     *
     * @param interception
     * The interception to set.
     *
     * @returns
     * This collection.
     */
    public override set<TKey extends keyof T>(key: TKey, interception: IInterception<T, TKey>): this
    {
        return super.set(key, interception);
    }
}
