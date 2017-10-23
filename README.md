tryMax
===

[![Build Status](https://travis-ci.org/marcinporebski/tryMax.svg?branch=master)](https://travis-ci.org/marcinporebski/tryMax)
[![Coverage Status](https://coveralls.io/repos/github/marcinporebski/tryMax/badge.svg?branch=master)](https://coveralls.io/github/marcinporebski/tryMax?branch=master)

> Retry a promise if it fails, try max N times, retry conditionally, exponential back-off.

Easy to use retry behaviour for JavaScript and TypeScript.

Installation
---
```
npm install trymax
```

API
---
```
tryMax(numberOfRetrier: number, func: Function, options: Options): Function
```
Returns wrapped function with interface identical to `func`.
Options (all are optional):
- `delay` - `(n: number) => number` defines the delay between retries, default: `oneSecond`
- `retryCondition` - `() => boolean` defines if in this retry attempt the `func` should be executed or not, default: `retryAlways`

Example:
```
const { tryMax, expBackoff, retryIf } = require('trymax');
const ws = /* websocket */

const sendSomething = tryMax(5, () => (sendSomethingAsync()), 
      {
        delay: expBackoff, 
        retryCondition: retryIf(() => (ws.readyState === 1))
      }
);

await sendSomething();
```

Usage
---
`tryMax` wraps a function that returns a promise with retry behavior. The newly returned function has the same interface as the original one, but will retry N times if the original function fails.

See this artificial example with a function that will fail always the first two times:

```
let counter = 0;
const fail2Times = input => {
  counter++;
  if (counter > 2) {
    return Promise.resolve(input);
  }
  console.log(`fail ${counter}`);
  return Promise.reject('fail');
};
```

Now if you use `tryMax` wrapper you can call this function without worying about those failed attempts:

```
const { tryMax } = require('trymax');
const fail2TimesAssured = tryMax(3, fail2Times);
const result = await fail2TimesAssured('hello!');
console.log(result);
```

And the console output is:
```
fail 1
fail 2
hello!
```

Use-cases
---
__Try-catch-like retry block__
```
tryMax(5, async () => {
  // some code that may fail 
  // and you want to auto-retry it at most 5 times
})();
```
__External services__

Assuming that we have a `service` that is an external thing - accesible through REST or websockets, that sometimes fails to return a response:
```
const getLatestUpdates = tryMax(5, service.getLatestUpdates);
const latestUpdates = await getLatestUpdates();
```
Or if sometimes it requires re-authentication - obtaining another api-key (if it has time-to-live), then we can check if the connection is still alive:

```
const getLatestUpdates = tryMax(5, service.getLatestUpdates, {retryCondition: () => (service.isConnected())});
...
```

