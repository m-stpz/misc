# Firestore

- Brain of Firebase application
- NoSQL Document db
- Stores data in flexible, JSON-like documents

## Data model: Documents | Collections | Subcollections

| Level         | definition                                          | analogy                           |
| ------------- | --------------------------------------------------- | --------------------------------- |
| collection    | a container for documents. It cannot contain fields | a folder for holding the papers   |
| document      | a single record (JSON-like) containing fields       | a single sheet of paper           |
| subcollection | a collection that lices "inside" a document         | small envelope stapled to a paper |

- Documents can only live inside collections
- When performing operations, we update the document. Collections are just containers

## Querying

- It's about narrowing down the data

| Operation      | example                                               |
| -------------- | ----------------------------------------------------- |
| equality       | `.where('type', '==', 'user')                         |
| range          | `.where('price', '>', 500).where('price', '<=', 1000) |
| array contains | `.where('tags', 'array-contains', 'angular')`         |
| in-filter      | `.where('status', 'in', ['pending', 'shipped'])`      |

### Simple Equality & Comparison

- the basic: `==`, `!=`, `<`, `<=`, `>`, `>=`
- they can be chained

```ts
// where(field, comparing, desired-field)

const q = db
  .collection("products")
  .where("category", "==", "electronics")
  .where("status", "==", "active")
  .where("price", "<", 500);
```

### Array and membership queries

| operator             | use case                                  | example                                                   |
| -------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `array-contains`     | document has a list, find if "x" is in it | `.where("tags", "array-contains", "angular")`             |
| `in`                 | field matches any of up to 30 values      | `.where("status", "in", ["draft", "published"])`          |
| `array-contains-any` | document list has at least one of these   | `.where("tags", "array-contains-any", ["web", "mobile"])` |

### Ordering and limiting

- By default, firestore doesn't return docs in a specific order. We usually sort them

```ts
const q = db.collection("orders").orderBy("createdAt", "desc").limit(10); // sort: newest firsts
```

## CRUD Operations

| operation | command    | target         | key difference                                          |
| --------- | ---------- | -------------- | ------------------------------------------------------- |
| create    | `add()`    | collection     | automatically generates unique id                       |
| create    | `set()`    | document       | uses the id your provide. can overwrite data            |
| read      | `get()`    | doc/collection | returns a "Snapshot". must call `data()` to see content |
| update    | `update()` | document       | fails if the document doesn't exist                     |
| delete    | `delete()` | document/field | doesn't delete subcollections within the document       |

### Create

- There are two ways to create data depending on whether you want to choose the id or let firebase generate one
  - add: automatic id
  - set: you choose the id

```ts
import { getFirestore } from "firebase-admin/firestore";
const db = getfirestore();

// A. `add`: auto-generated ID
const newOrderRef = await db.collection("orders").add({
  item: "laptop",
  price: 1200,
}); // add a document within the `orders` collection

// B. `set`: set with specific ID (good for users, where ID = Auth Id)
await db.collection("users").doc("user_123").set({
  name: "john doe",
  email: "j@gmail.com",
});
```

### Read

- We can fetch one document or an entire group

```ts
// single document
const userSnap = await db.collection("users").doc("user_123").get(); // returns a .data

if (userSnap.exists) {
  console.log(userSnap.data());
}

// get a whole collection | querying
const ordersSnap = await db
  .collection("orders")
  .where("price", ">", 1000)
  .get();

ordersSnap.forEach((doc) => console.log(doc.id, "->", doc.data()));
```

### Delete

- We can delete a specific document or field within document

```ts
// delete entire doc
await db.collection("orders").doc("order_123").delete();

// dele single field
await db.collection("users").doc("user_123").update({
  temporaryToken: FieldValue.delete(),
});
```

### Update

- `update()` only changes the field you provide
- `set()` with `merge:true` does the same
  - `set()` without merge, overwrites the entire document

```ts
const userRef = db.collection("users").doc("user_123");

// standard update
await userRef.update({
  lastLogin: new Date().toISOString(),
  "settings.theme": "dark", // use dot.notation for nested fields
});

// special increment | atomic
// use this to prevent race conditions (e.g., two people buying at once)
import { FieldValue } from "firebase-admin/firestore";

await userRef.update({
  loginCount: FieldValue.increment(1),
});
```

## Transactions

- Ensures that read/write happen as one atomic unit
  - Meaning, you can't do a "write" before a "read" inside a transaction
- If someone else changes the data while your transaction is running, Firestore retries it automatically

```ts
const aliceRef = db.collection("users").doc("alice");
const bobRef = db.collection("users").doc("bob");

await db.runTransaction(async (t) => {
  const aliceSnap = await t.get(aliceRef);
  const aliceBalance = aliceSnap.data().balance;

  if (aliceBalance < 100) {
    throw "insufficient funds";
  }

  t.update(aliceRef, { balance: aliceBalance - 100 });
  t.update(bobRef, { balance: FieldValue.increment(100) });
});
```

## Batched Writes | Bulk upload pattern

- If we need to perform > 500 writes and don't need to read any data first, batch update is the path
- Faster and cheaper than individual calls
- "All or nothing", if one fails, all fail

```ts
const batch = db.batch();

const doc1 = db.collection("logs").doc(); // auto-id
batch.set(doc1, { msg: "first log" });

const doc2 = db.collection("users").doc("user_123");
batch.update(doc2, { status: "active" });
```

## to learn

- after changing the cloud function, do I need to rebuild them?
  - how and what's the best way to do this?
- what's a standard folder structure for cloud functions? how are they organized?
- what's the repository pattern?
  - don't call firestore directly, all data access goes through a datarepository<model, pathprops>
- how to have a path property?
- to check patterns we use
- firestore rules
