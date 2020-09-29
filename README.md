# Interceptor
Provides a convenient way to intercept method- property- and accessor-calls of an object.

## Installing the package
This package can be added to your dependencies by invoking:

```bash
npm i -D @manuth/interceptor
```

## Creating an `Interceptor`
An interceptor can be initialized by passing an object to intercept.
The constructor accepts a second, optional argument which specifies whether the object should be freezed on creation. This allows you to ignore future updates of the interceptor-target.

```ts
import { Interceptor } from "@manuth/interceptor";

let target = {
    a: 10
};

let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;
target.a = 20;
console.log(proxy.a); // Logs `20`
```
```ts
import { Interceptor } from "@manuth/interceptor";

let target = {
    a: 10
};

let interceptor = new Interceptor(target, true);
let proxy = interceptor.Proxy;
target.a = 20;
console.log(proxy.a); // Logs `10`
```

### Adding a Property-Interception
Fields and accessors can be intercepted by adding a property-interception.

You can add property-interceptions by invoking the `Interceptor#AddProperty`-method.

A property-interception allows you to specify a getter, a setter and a method for checking the existence of the property.

```ts
let target = {
    a: 10
};

let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;
interceptor.AddProperty(
    "a",
    {
        Get: (target, key) =>
        {
            console.log(key); // Logs `"a"`
            return target[key] + 2;
        }
    });

console.log(proxy.a); // Logs `12`
target.a = 20;
console.log(proxy.a); // Logs `22`
proxy.a = 22; // Throws an error
```

```ts
interceptor.AddProperty(
    "a",
    {
        Get: (target, key) => target[key],
        Set: (target, key, value) => target[key] = value,
        Has: () => false
    });

console.log("a" in proxy); // Logs `false`
proxy.a = 27;
console.log(proxy.a); // Logs `27`
```

### Adding a Method-Interception
Method-interceptions take at least two arguments:
The target of the interception, the name of the method.

All the other arguments represent the arguments of the original method:

```ts
let target = {
    Sum(x: number, y: number): number
    {
        return x + y;
    }
};

let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;

interceptor.AddMethod(
    "Sum",
    (target, key, x, y) =>
    {
        target[key](x++, y++);
    });

console.log(proxy.Sum(1, 1)); // Logs `4`
```

### Hiding Methods or Properties
The `AddProperty`-method also allows you to hide methods or properties ba neither declaring a `Get`ter nor a `Set`ter:

```ts
let target = {
    a: 10,
    Sum(x, y)
    {
        return x + y;
    }
};

let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;

interceptor.AddProperty("a", {});
interceptor.AddProperty("Sum", null);
console.log(proxy.a); // Throws an error
console.log(proxy.Sum(1, 1)); // Throws an error
```

### Deleting Interceptions
Interceptions can be removed using the `Interception#Delete`-method:

```ts
let target = {
    a: 10
};

let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;

interceptor.AddProperty(
    "a",
    {
        Get: () => 20
    });

console.log(proxy.a); // Logs `20`
interceptor.Delete("a");
console.log(proxy.a); // Logs `10`
```

### Deleting all Interceptions
The `Interception#Clear`-method allows you to remove all interceptions.

```ts
let target = {};
let interceptor = new Interceptor(target);
let proxy = interceptor.Proxy;

interceptor.AddProperty(
    "a",
    {
        Get: () => 10
    });

interceptor.AddProperty(
    "b",
    {
        Get: () => 20
    });

console.log(proxy.a); // Logs `10`
console.log(proxy.b); // Logs `20`
interceptor.Clear();
console.log(proxy.a); // Logs `undefined`
console.log(proxy.b); // Logs `undefined`
```

### Disposing the `Interceptor`
The `Interceptor` can be disposed. This causes all interceptions to be deactivated. Instead all method-, property- and field-calls are redirected to the target directly.

This allows you to permanently disable your interceptions.

```ts
interceptor.Dispose();
```
