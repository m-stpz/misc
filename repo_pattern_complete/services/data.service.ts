/**
 * ===
 * Data service: abstraction layer between repositories and firestore
 * ===
 * - Repositories never call Firestore directly. They call DataService methods
 * - In the real codebase, FirestoreService implements this interface using the Admin SDK
 */

import { ModelInterface } from "../models/base.model";

/**
 * Query constraint for filtering collections
 */
export interface QueryConstraint {
  field: string;
  op: "==" | "!=" | "<" | ">" | "<=" | ">=" | "in" | "array-contains";
  value: unknown;
}

export type QueryFn = (ref: unknown) => unknown; // simplified: real version uses firestore

/**
 * DataService interface
 * - The contract that FirestoreService implements
 * - Repositories depend on THIS interface , not on Firestore directly
 *
 * - Here, we basically say what operations are possible on the data layer
 */
export interface DataService {
  /** Read single doc
   * - we need to pass document<T ...> because we use T in the arguments
   */
  document<T extends ModelInterface>(path: string): Promise<T | null>;

  /** Query a collection */
  query<T extends ModelInterface>(
    collectionPath: string,
    queryFn?: QueryFn,
  ): Promise<T[]>;

  /** counts documents within a collection */
  count(collectionPath: string, queryFn?: QueryFn): Promise<number>;

  /** create/overwrite a doc */
  set<T extends ModelInterface>(path: string, data: T): Promise<void>;

  /** partial update of a document */
  update<T extends ModelInterface>(
    path: string,
    data: Partial<T>,
  ): Promise<void>;

  /** deletes a doc */
  delete(path: string): Promise<void>;

  /** atomic increment of a numeric field */
  increment(path: string, field: string, amount: number): Promise<void>;

  /** atomic array union */
  arrayUnion(path: string, field: string, values: unknown[]): Promise<void>;

  /** atomic array remove */
  arrayRemove(path: string, field: string, values: unknown[]): Promise<void>;
}
