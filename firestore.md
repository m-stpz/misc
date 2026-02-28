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

## CRUD Operations

| operation | command    | target         | key difference                                          |
| --------- | ---------- | -------------- | ------------------------------------------------------- |
| create    | `add()`    | collection     | automatically generates unique id                       |
| create    | `set()`    | document       | uses the id your provide. can overwrite data            |
| read      | `get()`    | doc/collection | returns a "Snapshot". must call `data()` to see content |
| update    | `update()` | document       | fails if the document doesn't exist                     |
| delete    | `delete()` | document       | doesn't delete subcollections within the document       |

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

- What are the possibilities of querying?

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
