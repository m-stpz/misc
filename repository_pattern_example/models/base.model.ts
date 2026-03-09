// ============================================================
// BASE MODEL — Foundation for all Firestore models
// ============================================================
// Every model needs: an interface, path properties, and a path class.
// The path class tells the repository WHERE in Firestore to read/write.

export type ID = string;

/** Every Firestore document must have an `id` */
export interface ModelInterface {
  id: ID;
}

/** Minimum path info needed to locate a document/collection */
export interface BasePathProperties {
  id?: ID;
}

/** Properties needed to resolve a Firestore path */
export interface FirestorePathProperties extends BasePathProperties {
  [key: string]: unknown;
}

/**
 * Base path class — each model extends this to define its collection path.
 * The repository uses `collectionPath` to know where documents live.
 */
export abstract class BasePath<T extends FirestorePathProperties> {
  constructor(protected readonly props: T) {}

  abstract get collectionPath(): string;

  get documentPath(): string | null {
    return this.props.id
      ? `${this.collectionPath}/${this.props.id}`
      : null;
  }
}
