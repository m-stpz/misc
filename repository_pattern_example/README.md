# Mock Backend — Architecture Template

A stripped-down reference showing how **every** layer connects for a CRUD feature.

## Folder Structure

```
mock_backend/
├── models/
│   ├── base.model.ts           ← Base interfaces (ModelInterface, BasePath)
│   └── meeting.model.ts        ← Concrete model, path props, path class, ACL type
│
├── repositories/
│   ├── data.repository.ts      ← Generic base (get, find, save, update, delete, atomic ops)
│   └── meeting.repository.ts   ← Concrete repo (3 lines + optional domain queries)
│
├── services/
│   ├── data.service.ts         ← Interface that FirestoreService implements
│   ├── auth.service.ts         ← Server-side auth + role checks
│   └── meeting.service.ts      ← Business logic (orchestrates repos + side effects)
│
├── functions/
│   ├── api.ts                  ← Single onCall router → dispatches to handlers
│   └── api/
│       ├── create-meeting.ts   ← Handler: preflight → authorize → execute
│       ├── get-meeting.ts
│       ├── update-meeting.ts
│       └── delete-meeting.ts
│
├── permissions/
│   └── acl.utils.ts            ← Document-level ACL helpers (u-, g-, b- keys)
│
├── utils/
│   ├── errors.ts               ← Typed error factories (never expose internals)
│   └── security-log.ts         ← Security event logging (never log PII)
│
└── frontend/
    ├── meeting.service.ts      ← Angular service wrapping the callable function
    └── meeting-list.component.ts ← Component using signals, OnPush, inject()
```

## Data Flow (end to end)

```
Component  →  Frontend Service  →  Firebase onCall  →  API Router  →  Handler  →  Service  →  Repository  →  Firestore
   ↑                                                                     │
   │                                                              (auth + validate
   │                                                               + ACL check)
   └──────────────────── response ───────────────────────────────────────┘
```

## The 7 Concepts

| # | Concept | Where | Key Rule |
|---|---------|-------|----------|
| 1 | **Model + Path** | `models/` | Every entity defines its Firestore path via a Path class |
| 2 | **Repository** | `repositories/` | ALL Firestore access goes through here — never direct calls |
| 3 | **DataService** | `services/data.service.ts` | Interface between repos and Firestore — repos are DB-agnostic |
| 4 | **Service** | `services/meeting.service.ts` | Business logic, side effects, orchestration — repos just do I/O |
| 5 | **Handler** | `functions/api/*.ts` | 3-phase: **preflight** → **authorize** → **execute** |
| 6 | **ACL** | `permissions/` | Document-level access via `u-`, `g-`, `b-` identity keys |
| 7 | **Frontend** | `frontend/` | Calls `apiCall` callable — never Firestore directly for writes |

## Handler Pattern (every function follows this)

```typescript
export async function handler(data: unknown, authService: AuthService) {
  // 1. PREFLIGHT — is the user authenticated? is the input valid?
  if (!(await authService.isAuthenticated())) throw unauthenticated;
  if (!validate(data)) throw invalidArgument;

  // 2. AUTHORIZE — does the user have permission for this action?
  //    Role-based (isGroupAdmin) OR document-level (ACL check)
  if (!hasPermission(doc.acl, userId, 'write')) throw permissionDenied;

  // 3. EXECUTE — call the service layer
  return await service.doWork(data);
}
```
