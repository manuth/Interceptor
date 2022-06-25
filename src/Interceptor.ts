import cloneDeep = require("lodash.clonedeep");
import { IInterception } from "./IInterception";
import { InterceptionCollection } from "./InterceptionCollection";
import { MethodInterception } from "./MethodInterception";

/**
 * Provides the functionality to intercept methods of an object.
 *
 * @template T
 * The type of the target of the {@link Interceptor `Interceptor`}.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Interceptor<T extends {}>
{
    /**
     * The target of the interceptor.
     */
    private target: T;

    /**
     * The proxy that invokes the interceptions.
     */
    private proxy: T;

    /**
     * The interceptions.
     */
    private interceptions: InterceptionCollection<T> = new InterceptionCollection();

    /**
     * A value indicating whether the interceptor is disposed.
     */
    private disposed: boolean;

    /**
     * Initializes a new instance of the {@link Interceptor `Interceptor<T>`} class.
     *
     * @param target
     * The target of the interceptor.
     *
     * @param freeze
     * A value indicating whether the interceptor should ignore future changes made to the {@link target `target`}.
     */
    public constructor(target: T, freeze?: boolean)
    {
        if (freeze)
        {
            let clone = cloneDeep(target);
            this.target = clone;

            for (let property of Object.getOwnPropertyNames(target))
            {
                if (property in target)
                {
                    Object.defineProperty(
                        this.target,
                        property,
                        Object.getOwnPropertyDescriptor(target, property));
                }
            }

            Object.assign(this.target, { ...clone });
        }
        else
        {
            this.target = target;
        }

        this.proxy = new Proxy<T>(
            this.target,
            {
                has: (target: T, property: keyof T & (string | symbol)) =>
                {
                    if (!this.Disposed)
                    {
                        if (this.interceptions.has(property))
                        {
                            let properties: Array<keyof IInterception<T, keyof T>> = [
                                "Get",
                                "Set"
                            ];

                            let interception = this.interceptions.get(property);
                            return interception?.Has?.(target, property) ?? properties.some((property) => interception?.[property]);
                        }
                        else
                        {
                            return property in target;
                        }
                    }
                    else
                    {
                        return property in this.target;
                    }
                },
                get: (target: T, property: keyof T & (string | symbol)): Partial<T>[keyof T] =>
                {
                    if (!this.Disposed)
                    {
                        return this.interceptions.get(property)?.Get(target, property) ?? target[property];
                    }
                    else
                    {
                        return this.target[property];
                    }
                },
                set: (target: T, property: keyof T & (string | symbol), value: any): boolean =>
                {
                    if (
                        !this.Disposed &&
                        this.interceptions.has(property))
                    {
                        this.interceptions.get(property)?.Set(target, property, value);
                    }
                    else
                    {
                        this.target[property] = value;
                    }

                    return true;
                }
            });
    }

    /**
     * Gets the target of the interceptor.
     */
    public get Target(): T
    {
        return this.target;
    }

    /**
     * Gets the installed interceptions.
     */
    public get Interceptions(): ReadonlyMap<keyof T, IInterception<T, keyof T>>
    {
        return new Map(this.interceptions);
    }

    /**
     * Gets the proxy for intercepting calls.
     */
    public get Proxy(): T
    {
        return this.proxy;
    }

    /**
     * Gets a value indicating whether the interceptor is disposed.
     */
    public get Disposed(): boolean
    {
        return this.disposed;
    }

    /**
     * Adds a new property-interception.
     *
     * @template TKey
     * The type of the specified {@link key `key`}.
     *
     * @param key
     * The key of the interception to add.
     *
     * @param interception
     * The interception to add.
     */
    public AddProperty<TKey extends keyof T>(key: TKey, interception: IInterception<T, TKey>): void
    {
        if (!this.interceptions.has(key))
        {
            this.interceptions.set(key, interception);
        }
        else
        {
            throw new RangeError(`An interception with the key \`${key.toString()}\` already exists!`);
        }
    }

    /**
     * Adds a new interception.
     *
     * @template TKey
     * The type of the specified {@link key `key`}.
     *
     * @param key
     * The key of the interception to add.
     *
     * @param interception
     * The interception to add.
     */
    public AddMethod<TKey extends keyof T>(key: TKey, interception: MethodInterception<T, TKey>): void
    {
        this.AddProperty(
            key,
            {
                Get: (target, key): T[TKey] =>
                {
                    return ((...args: unknown[]): unknown => interception(target, target[key], ...args)) as unknown as T[TKey];
                }
            });
    }

    /**
     * Deletes an interception.
     *
     * @param key
     * The key of the interception to delete.
     */
    public Delete(key: keyof T): void
    {
        this.interceptions.delete(key);
    }

    /**
     * Clears all interceptions.
     */
    public Clear(): void
    {
        this.interceptions.clear();
    }

    /**
     * Disposes the interceptor.
     */
    public Dispose(): void
    {
        this.disposed = true;
        this.interceptions.clear();
    }
}
