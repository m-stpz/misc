// ============================================================
// DATA SERVICE — The abstraction layer between repositories and Firestore
// ============================================================
// Repositories never call Firestore directly. They call DataService methods.
// In the real codebase, FirestoreService implements this interface using the Admin SDK.

import { ID, ModelInterface } from '../models/base.model';

/** Query constraint for filtering collections */
export interface QueryConstraint {
  field: string;
  op: '==' | '!=' | '<' | '>' | '<=' | '>=' | 'in' | 'array-contains';
  value: unknown;
}

export type QueryFn = (ref: unknown) => unknown; // Simplified — real version uses Firestore types

/**
 * DataService interface — the contract that FirestoreService implements.
 * Repositories depend on THIS interface, not on Firestore directly.
 */
export interface DataService {
  /** Read a single document */
  document<T extends ModelInterface>(path: string): Promise<T | null>;

  /** Query a collection */
  query<T extends ModelInterface>(collectionPath: string, queryFn?: QueryFn): Promise<T[]>;

  /** Count documents in a collection */
  count(collectionPath: string, queryFn?: QueryFn): Promise<number>;

  /** Create or overwrite a document */
  set<T extends ModelInterface>(path: string, data: T): Promise<void>;

  /** Partial update of a document */
  update(path: string, data: Partial<Record<string, unknown>>): Promise<void>;

  /** Delete a document */
  delete(path: string): Promise<void>;

  /** Atomic increment of a numeric field */
  increment(path: string, field: string, amount: number): Promise<void>;

  /** Atomic array union */
  arrayUnion(path: string, field: string, values: unknown[]): Promise<void>;

  /** Atomic array remove */
  arrayRemove(path: string, field: string, values: unknown[]): Promise<void>;
}
