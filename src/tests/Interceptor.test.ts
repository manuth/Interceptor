import { doesNotThrow, notStrictEqual, ok, strictEqual, throws } from "node:assert";
import { Random } from "random-js";
import { Interceptor } from "../Interceptor.js";
import { MethodInterception } from "../MethodInterception.js";

/**
 * Registers tests for the {@link Interceptor `Interceptor<T>`} class.
 */
export function InterceptorTests(): void
{
    suite(
        nameof(Interceptor),
        () =>
        {
            /**
             * The replacement for the method.
             *
             * @returns
             * A value.
             */
            let methodReplacement = (): number => 10 + 20;

            let random = new Random();
            let propertyName = "a" as const;
            let untouchedPropertyName = "b" as const;
            let methodName = "x" as const;
            let untouchedMethodName = "y" as const;
            let propertyReplacement = 10;

            let target = {
                [propertyName]: random.integer(1, 10),
                [untouchedPropertyName]: random.integer(1, 10),
                [methodName]: (): number => 198,
                [untouchedMethodName]: (): number => 387
            };

            let interceptor: Interceptor<typeof target>;

            suiteSetup(
                () =>
                {
                    interceptor = new Interceptor(target);
                });

            setup(
                () =>
                {
                    interceptor?.Clear();
                });

            suite(
                nameof(Interceptor.constructor),
                () =>
                {
                    test(
                        "Checking whether the constructor can be invoked without errors…",
                        () =>
                        {
                            doesNotThrow(() => new Interceptor(target));
                            doesNotThrow(() => new Interceptor(target, true));
                            doesNotThrow(() => new Interceptor(target, false));
                        });

                    test(
                        `Checking whether a frozen clone of the target can be created for the \`${nameof(Interceptor)}\`…`,
                        () =>
                        {
                            let interceptor = new Interceptor(target, true);
                            interceptor.Target[propertyName]++;
                            notStrictEqual(interceptor.Target[propertyName], target[propertyName]);
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.Target),
                () =>
                {
                    test(
                        "Checking whether the target can be queried…",
                        () =>
                        {
                            strictEqual(target, interceptor.Target);
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.Interceptions),
                () =>
                {
                    test(
                        "Checking whether the interceptions can be queried…",
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    for (let { } of interceptor.Interceptions) { }
                                });
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.AddProperty),
                () =>
                {
                    test(
                        "Checking whether property-interceptions can be added…",
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Get: () =>
                                            {
                                                return propertyReplacement;
                                            }
                                        });
                                });

                            ok(interceptor.Interceptions.has(propertyName));
                        });

                    test(
                        "Checking whether adding duplicate property-interceptions throws an error…",
                        () =>
                        {
                            interceptor.AddProperty(propertyName, null);
                            throws(() => interceptor.AddProperty(propertyName, null), RangeError);
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.AddMethod),
                () =>
                {
                    test(
                        "Checking whether property-interceptions can be added…",
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    interceptor.AddMethod(
                                        methodName,
                                        () =>
                                        {
                                            return methodReplacement();
                                        });
                                });

                            ok(interceptor.Interceptions.has(methodName));
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.Delete),
                () =>
                {
                    test(
                        "Checking whether interceptions can be deleted…",
                        () =>
                        {
                            for (let key of [propertyName, methodName])
                            {
                                doesNotThrow(
                                    () =>
                                    {
                                        interceptor.Delete(key);
                                    });

                                ok(!interceptor.Interceptions.has(key));
                            }
                        });
                });

            suite(
                nameof<Interceptor<any>>((interceptor) => interceptor.Proxy),
                () =>
                {
                    let proxy: typeof target;

                    suiteSetup(
                        () =>
                        {
                            proxy = interceptor.Proxy;
                        });

                    suite(
                        "Properties",
                        () =>
                        {
                            test(
                                "Checking whether properties are intercepted correctly…",
                                () =>
                                {
                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Get: () => propertyReplacement
                                        });

                                    strictEqual(proxy[propertyName], propertyReplacement);
                                });

                            test(
                                "Checking whether untouched properties can be queried…",
                                () =>
                                {
                                    strictEqual(proxy[untouchedPropertyName], target[untouchedPropertyName]);
                                });

                            test(
                                "Checking whether properties can be manipulated using interceptions…",
                                () =>
                                {
                                    /**
                                     * Manipulates the value.
                                     *
                                     * @param value
                                     * The value to manipulate.
                                     *
                                     * @returns
                                     * The manipulated value.
                                     */
                                    let manipulator = (value: number): number =>
                                    {
                                        return (value ** value) * 7 - value * 20;
                                    };

                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Get: (target, property) =>
                                            {
                                                return manipulator(target[property]);
                                            }
                                        });

                                    strictEqual(proxy[propertyName], manipulator(target[propertyName]));
                                });

                            test(
                                "Checking whether readonly properties can be created…",
                                () =>
                                {
                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Get: (target, property) =>
                                            {
                                                return target[property];
                                            }
                                        });

                                    doesNotThrow(() => proxy[propertyName]);
                                    throws(() => proxy[propertyName] = 10);
                                });

                            test(
                                "Checking whether write-only properties can be created…",
                                () =>
                                {
                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Set: () => { }
                                        });

                                    doesNotThrow(() => proxy[propertyName] = 10);
                                    throws(() => proxy[propertyName]);
                                });

                            test(
                                "Checking whether the visibility of properties can be specified…",
                                () =>
                                {
                                    let visible = true;
                                    let value = 10;

                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Has: () => visible,
                                            Get: () => value
                                        });

                                    ok(propertyName in proxy);
                                    strictEqual(proxy[propertyName], value);
                                    visible = false;
                                    ok(!(propertyName in proxy));
                                    strictEqual(proxy[propertyName], value);
                                });

                            test(
                                "Checking whether properties with a getter or a setter are visible by default…",
                                () =>
                                {
                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Get: (target) => target[propertyName]
                                        });

                                    ok(propertyName in proxy);
                                    interceptor.Delete(propertyName);

                                    interceptor.AddProperty(
                                        propertyName,
                                        {
                                            Set: () => { }
                                        });

                                    ok(propertyName in proxy);
                                });

                            test(
                                "Checking whether properties without getter or setter are invisible…",
                                () =>
                                {
                                    interceptor.AddProperty(propertyName, {});
                                    ok(!(propertyName in proxy));
                                    interceptor.Delete(propertyName);
                                    interceptor.AddProperty(propertyName, null);
                                    ok(!(propertyName in proxy));
                                });
                        });

                    suite(
                        "Methods",
                        () =>
                        {
                            test(
                                "Checking whether methods are intercepted correctly…",
                                () =>
                                {
                                    interceptor.AddMethod(
                                        methodName,
                                        () =>
                                        {
                                            return methodReplacement();
                                        });

                                    strictEqual(proxy[methodName](), methodReplacement());
                                });

                            test(
                                "Checking whether untouched methods can be executed…",
                                () =>
                                {
                                    strictEqual(proxy[untouchedMethodName](), target[untouchedMethodName]());
                                });

                            test(
                                "Checking whether methods can be manipulated using interceptions…",
                                () =>
                                {
                                    let originalMethod = target[methodName];

                                    /**
                                     * Manipulates a method.
                                     *
                                     * @param targetObject
                                     * The object to execute the manipulator on.
                                     *
                                     * @param delegate
                                     * The original method.
                                     *
                                     * @returns
                                     * The manipulated value.
                                     */
                                    let manipulator = (targetObject: typeof target, delegate: typeof originalMethod): number =>
                                    {
                                        return delegate() + 870 * Object.keys(targetObject).length;
                                    };

                                    interceptor.AddMethod(
                                        methodName,
                                        (target, delegate) =>
                                        {
                                            return manipulator(target, delegate);
                                        });

                                    strictEqual(proxy[methodName](), manipulator(target, target[methodName]));
                                });

                            test(
                                "Checking whether arguments can be used correctly…",
                                () =>
                                {
                                    let testMethodName = "test" as const;
                                    let testArg = random.int32();

                                    let testTarget = {
                                        /**
                                         * A test-method.
                                         *
                                         * @param testArg
                                         * A test-argument.
                                         *
                                         * @returns
                                         * A value.
                                         */
                                        [testMethodName](testArg: number): number
                                        {
                                            return (testArg * 7 + 28) / 6;
                                        }
                                    };

                                    let testInterceptor = new Interceptor(testTarget);

                                    /**
                                     * A manipulator.
                                     *
                                     * @param target
                                     * The target of the manipulator.
                                     *
                                     * @param delegate
                                     * The original method.
                                     *
                                     * @param args
                                     * The passed arguments.
                                     *
                                     * @returns
                                     * A value.
                                     */
                                    let manipulator: MethodInterception<typeof testTarget, typeof testMethodName> = (target, delegate, ...args) =>
                                    {
                                        return args[0] * 80 / 28;
                                    };

                                    testInterceptor.AddMethod(testMethodName, manipulator);
                                    strictEqual(testInterceptor.Proxy[testMethodName](testArg), manipulator(testTarget, testTarget[testMethodName], testArg));
                                });
                        });
                });
        });
}
