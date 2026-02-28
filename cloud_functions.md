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

#### Different triggers

##### 1. HTTPS Callable: Direct client-to-backend

- Responds to an user action:
  - button click
  - called by the client

```ts
export const getWeather = onCall(async (request) => {
  const city = request.data.city; // access data sent from angular

  const uid = request.auth?.uid; // authentication context automatically provided

  return { temparature: 22, unit: "celsius" };
});
```

##### 2. Firestore triggers: db events

- Reacts to data changes
- Happens in the background when a document is modified

```ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// triggered whenever a document is created in the "messages" collection
export const notifyOnNewMessage = onDocumentCreated(
  "messages/{messageId}",
  (event) => {
    const newValue = event.data?.data(); // document content
    const messageId = event.params.messageId; // the id from the url

    // do something
  },
);
```

##### 3. Authentication trigger

- Useful for 'setting up' a user the moment they register

```ts
import { onCreate } from "firebase-functions/v2/auth";

export const initializeUser = onCreate((user) => {
  const email = user.email;
  const displayName = user.displayName;

  // do something
});
```

##### 4. Cloud storage trigger

- Reacts to file uploads, deletions, or metadata changes

```ts
import { onObjectFinalized } from "firebase-functions/v2/storage";

export const generateThumbnail = onObjectFinalized((event) => {
  const bucket = event.data.bucket;
  const filepath = event.data.name;
  const contentPath = event.data.contentType;

  // do something
});
```

##### 2.

### 3. Execution environment

- Primary environments are node and python
- Admin SDK:
  - skeleton key
  - they run in a trusted server environment, the admin sdk gives us full, unrestricted access to your db and storage, bypassing security rules
- Secret management: never hardcode API keys
  - firebase uses google cloud secret manager to securely inject sensitive data into your functions at runtime

### 4. 1st gen vs 2nd gen

- 1st gen: classic version
  - reliable, but has lower limits on request size and execution time
- 2nd gen: standard
  - built on cloud run
  - supports longer request timeouts (up to 60 mins for http)
  - large instances (up to 32gb)
  - concurrency: handling multiple requests with one instance to save money and reduce cold starts

### 5. Local emulator

- Allows us to run a mock version of the entire firebase backend locally
- The emulator suite is a set of local server processes (written in Java) that mimic the behavior of real firebase services
- UI: provides a local web dashboard (usually `localhost:4000`), where we can manually edit db entries, view logs, and trigger functions

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

For further example, check `intermediate_example`

## Deploying

- When deploying, firebase orchestrates the infra update
- Containerization:
  - Google packages your code into a container image and stores it in the artifact registry
- Zero downtime
  - firebase uses "rolling updates"

```bash
# deploy everything: hosting, functions, firestore rules, etc
firebase deploy

# deploy only cloud functions
firebase deploy --only functions

# deploy specific function
firebase deploy --only functions:incrementCounter

# deploy functions and firestore rules together
firebase deploy --only functions,firestore
```

## CLI

```bash
# account and project setup
firebase login # connects terminal to goog
firebase proects:list # show all firebase projects
firebase use --add # links local folder to a specific firebase project [e.g., switching between staging and production]

# development and debugging
firebase init # interactive wizard to set up your project [always run this from the root]
firebase emulators:start # launches local env
firebase functions:log # streams cloud logs directly to terminal
    firebase functions:log --lines 50 # last 50 entries

# configuration and secrets
firebase functions:secrets:set STRIPE_KEY # securely uploads a sensitive key to google cloud secret manager
firebase functions:secrets:access STRIPE_KEY # checks if the secret is correctly set
```
