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
