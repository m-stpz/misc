/**
 * Base model: Foundation for all firestore models
 *
 * Every model needs:
 *  - interface
 *  - path properties
 *  - path class: tells the repo WHERE in Firestore to read/write
 */

export type ID = string;

/**
 * Every firestore document must have an `id`
 */
export interface ModelInterface {
  id: ID;
}

/**
 * Minimum path info needed to locate a document/collection
 */
export interface BasePathProperties {
  id?: ID;
}

/**
 * Properties needed to resolve a Firestore path
 */
export interface FirestorePathProperties extends BasePathProperties {
  [key: string]: unknown;
}

/**
 * Base path class:
 *  - each model extends this to define its collection path
 *  - repo uses `collectionPath` to know where document lives
 */
export abstract class BasePath<T extends FirestorePathProperties> {
  constructor(protected readonly props: T) {}

  /**
   * path to the collection (e.g, users, orgs/123/boards)
   */
  abstract get collectionPath(): string;

  /**
   * path to a specific document
   */
  get documentPath(): string | null {
    return this.props.id ? `${this.collectionPath}/${this.props.id}` : null;
  }
}
