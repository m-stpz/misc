# Repository pattern

- High-level architectural pattern
- It acts a middleman. Instead of components knowing how to talk to firestore, they just ask a repository for data

## What does it solve?

| Without repositories                                                       | With repositories                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| code duplication: every component writes `db.collection('boards').doc(id)` | DRY: the path logic `boards/{id}` lives in one plac                                    |
| typing issue: need to cast `.data() as Board` everywhere                   | type-safe: repo is generic <Board>, so methods always return a Board object            |
| firestore limits: `where in` only allows 30 IDs                            | auto-chunking: the repo handles the "chunking" (e.g., spliting 100 IDs into 4 queries) |
| testing: hard to mock entire firestore sdk                                 | mockable: easily swap a BoardRepository for a MockBoardRepo                            |

## Example

- Check `repository_pattern_example` files

## Data flow

| Layer       | component        | responsibility                                                 | speaks in              |
| ----------- | ---------------- | -------------------------------------------------------------- | ---------------------- |
| UI          | ProfileComponent | Handles user events & displays data                            | signals & html         |
| Logic       | UserRepository   | Enforces business logic                                        | models (`UserProfile`) |
| Base engine | DataRepository   | Handles CRUD boilerplate & path building & talks with firebase | Generics (`T`, `P`)    |
| Path engine | UserPath         | Computes the physical string: `users`                          | Paths & properties     |
