tryMax
===

[![Build Status](https://travis-ci.org/marcinporebski/tryMax.svg?branch=master)](https://travis-ci.org/marcinporebski/tryMax)
[![Coverage Status](https://coveralls.io/repos/github/marcinporebski/tryMax/badge.svg?branch=master)](https://coveralls.io/github/marcinporebski/tryMax?branch=master)

> Retry function or Promise to handle transient errors.

Easy to use retry behaviour for JavaScript and TypeScript.

Installation
---
```
npm install trymax
```

API - builder
---
```ts
tryMax(numberOfRetries: number).of(func: Function).delay(d: DelayFunction).retryIf(rc: MaybeAsyncFunction).call(...)
```



API - function wrapper
---
```ts
tryMax(numberOfRetrier: number, func: Function, options: Options): Function
```
Returns wrapped function with interface identical to `func` - `funcArg => funcResult`.
Options (all are optional):
- `delay` - `(n: number) => number` defines the delay between retries, default: `oneSecond`
- `retryCondition` - `() => boolean | funcResult` defines if in this retry attempt the `func` should be executed or not, default: `retryAlways`


__retryCondition__
The function of retryCondition is being executed between each attempt. If talking about REST request you can check the side-effects before
you retry the function, if talking about database queries you can re-establish the connection in case of failure. You can also alter the
result by responding arbitrary value (except from boolean).



Example:
```ts
#!/usr/bin/env ts-node
import axios from 'axios';
import { tryMax } from 'trymax';

const theUrl = 'http://localhost:3000';

async function main() {
    const errorProneGet = axios.get;
    const transientErrorSafeGet = tryMax(10, errorProneGet);
    const resp = await transientErrorSafeGet(theUrl);
    
    console.log(resp.data);
}

main();
```

Usage
---
`tryMax` wraps a function that returns a promise with retry behavior. The newly returned function has the same interface as the original one, but will retry N times if the original function fails.

See this artificial example with a function that will fail always the first two times:

```ts
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

```ts
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
```ts
tryMax(5, async () => {
  // some code that may fail 
  // and you want to auto-retry it at most 5 times
})();
```

__External services__

- Retrying REST requests
- Re-establish database connection when it's broken and wait with sending query when the connection is back again
- Improve error mitigation on frontend and retry gently actions

