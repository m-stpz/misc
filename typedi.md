# TypeDI

- Dependency injection (DI) framework for TS
- Manages the lifecycle and instantiation of your classes
- TypeDI maintains a container
- Container: central registry of all your services and repos

### What it does

- Automatic instantiation: instead of writing `new SomeRepository()`, TypeDI creates the instance for you the first time it's requested
- Singleton management: by default, it ensures that only one instance of each repo exists across entire app
- Deps resolution: If a `Service` needs a `UserRepository`, and that repository needs a `DatabaseConnection`, TypeDI wire them all together

### Concepts

1. Core rule is to never instantiate repositories manually
   - Never use `new` for repositories, let TypeDI handle it
   - If we used `new SomeRepo()`, and it depended on something else, you'd need to pass them on the instantiation every time
   - TypeDI handles this behind the scenes

2. Centralized registry (`provideRepositories`)
3. Accessing data anywhere

```ts
const repo = Container.get(BoardRepository);
```

### With vs. Without TypeDI

| feature       | without                                                           | with                                                        |
| ------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| instantiation | `const repo = new UserRepo(db, api)`                              | `const repo Container.get(UserRepo)`                        |
| maintenance   | if you add a param to a constructor, you need to update all files | update only the repo; TypeDI handles the rest               |
| consistency   | risk of creating multiple db connections                          | guaranteed singletons for repos                             |
| testing       | difficult to "mock" db                                            | easy to tell the container to return a "FakeRepo" for tests |
