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

- If adding a new feature, don't rewrite the logic. Just "extend" the base

```ts
// 1. define path
export const TaskPath = "projects/{projectId}/tasks";

// 2. create the repo
@Injectable({ providedIn: "root" })
export class TaskRepository extends DataRepository<
  Task,
  { projectId: string }
> {
  constructor(dataservice: DataService) {
    // the base class handles all CRUD logic
    super(Task, TaskPath as any, dataservice);
  }
}
```
