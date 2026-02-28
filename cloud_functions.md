# Cloud Functions

- Allows us to automatically run backend code in response to events triggered by Firebase features and HTTPS requests

## Concepts

### 1. Core principle: serverless

- 'Cloud' in 'cloud functions' means that we don't manage any servers
- Write a functions, deploy it, google handles the rest

#### Characteristics

- Event-driven:
  - code doesn't run 24/7
  - sits idle until a specific event 'pokes' it

- Automatic scaling:
- Pay as you go

### 2. Triggers

- Events that tell our functions to start
- Without them, they are just dormand files in the cloud

| Trigger category | Common events                            | Example Use cases                                                   |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| firestore        | `onDocumentCreated`, `onDocumentDeleted` | Send a 'welcome' notification when a user profile is created        |
| authentication   | `onCreate`, `onDelete`                   | initialize a user's record in the db immediately after they sign up |
| cloud storage    | `onObjectFinalized`                      | automatically resize an imager after a user uploads it              |
| HTTPs            | `onRequest`, `onCall`                    | create a custom API endpoint for a 3rd party webhook                |
| Scheduled        | `onSchedule`                             | run up a script every night at 8 am                                 |

### Execution environment

- Primary environments are node and python
- Admin SDK:
  - skeleton key
  - they run in a trusted server environment, the admin sdk gives us full, unrestricted access to your db and storage, bypassing security rules
- Secret management: never hardcode API keys
  - firebase uses google cloud secret manager to securely inject sensitive data into your functions at runtime

### 1st gen vs 2nd gen

- 1st gen: classic version
  - reliable, but has lower limits on request size and execution time
- 2nd gen: standard
  - built on cloud run
  - supports longer request timeouts (up to 60 mins for http)
  - large instances (up to 32gb)
  - concurrency: handling multiple requests with one instance to save money and reduce cold starts

### Critical technical hurdles

#### Cold starts

- Since functions spin down to zero when not in use, the first request after a period of inactivity might take a few seconds to start
- Mitigate this by setting `minInstances` count
  - This ensures at least one instance is always 'warm' and ready

#### Idempotency

- Cloud functions are guaranteed to execute at least once, but ocasionally they might execute twice, due to network retries
- Your code must be **idempotent**, meaning, if the same function runs twice with the same data, it shouldn't cause bugs

### Development workflow

- Firebase cli: manage everything via command line
- Emulator suite: don't test in production
  - Firebase provides a local emulator that mimics the cloud environment on your laptop
- Logging: use `logger.log()` or `logger.error()`
  - These logs are piped directly to gcp, which your primary debugging tool

## Example

`basic_example`:

- function
- store
- component

Data flow:

- 1. user clicks button: component `increment` is triggered`
- 2. request sent: angular firebase sdk sends a secure HTTPs request to google's servers
- 3. function executes: cloud function spins up, executes, and sends back json response
- 4. stores updates: component receives the response and updates the signal store
- 5. UI reacts: angular watches the signal, and once it's updated by the store, the value in the html is updated

## Type safety between frontend and backend

- By default, `httpsCallable` is "blind
- It takes a string as the function name and returns `any`/`unknown`
- However, to achieve full end-to-end type safety using generics or shared interfaces

### Manual "Generic" approach

- Define the request data and respose data in a shared file and pass them to the `httpsCallable` method

```ts
interface CounterRequest {
  currentCount: number;
}
interface CounterResponse {
  total: number;
}

// use generics: <RequestType, ResponseType> | similar to redux
const incrementFn = httpsCallable<CounterRequest, CounterResponse>(
  this.functions,
  "incrementCounter", // still just a string!
);

const result = await incrementFn({ currentCount: 5 }); // now, ts knows 'data' has total
```

### True TS support | shared types

1. create a shared library that both angular app and cloud functions import

```ts
// shared/index.ts
export type FunctionNames = "incrementCounter" | "processPayment" | "sendEmail";
interface IncrementCounter {
  req: { currentCount: number };
  res: { total: number };
}
interface SendEmail {
  req: { to: string; body: string };
  res: { success: boolean };
}

export interface CloudFunctionsMap {
  incrementCounter: IncrementCounter;
  sendEmail: SendEmail;
}
```

2. Create a type-safe wrapper

- Instead of calling `httpsCallable` directly in every component, create a small helper service in angular

```ts
// src/app/api.service.ts
import { CloudFunctionsMap } from '../../shared';

callCloud<K extends keyof CloudFunctionsMap>(
  name: K,
  payload: CloudFunctionsMap[K]['req']
) {
  const feat = httpsCallable<CloudFunctionsMap[K]['req'], CloudFunctionsMap[K]['res']>(
    this.functions,
    name
  );
  return feat(payload);
}
```

- Now, in the component, we get autocomplete
  - if we type `this.api.callCloud('inc..'), it will suggest `incrementCounter`

## To learn

- local emulator
- having multiple functions
- shared interfaces
- any other important concept
- accessing the db/collections through cloud functions
