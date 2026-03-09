/**
 * ===
 * Data repository: generatic base for all firestore repos
 * ===
 * - Heart of the data access layer
 * - Every entity gets a concrete repo that extends this class
 * - NEVER call Firestore directly
 */

import {
  BasePath,
  FirestorePathProperties,
  ID,
  ModelInterface,
} from "../models/base.model";
import { DataService, QueryFn } from "../services/data.service";

/**
 * Generic base repo
 *
 * T = model type (e.g., Meeting)
 * PPT = path properties (e.g., MeetingPathProperties)
 *
 * - All CRUD operations go through here
 * - Concrete repos just provide:
 *  - model class
 *  - path class
 * then inherit everything
 */
export class DataRepository<
  T extends ModelInterface,
  PPT extends FirestorePathProperties,
> {
  constructor(
    private readonly _modelClass: new () => T, // do we use it?
    private readonly _pathClass: new (props: PPT) => BasePath<PPT>,
    private readonly _dataService: DataService,
  ) {}

  // == Helpers to build path ==
  private _path(props: PPT) {
    return new this._pathClass(props);
  }

  private _collectionPath(props: PPT): string {
    return this._path(props).collectionPath;
  }

  private _documentPath(props: PPT & { id: ID }) {
    const docPath = this._path(props).documentPath;

    if (!docPath) {
      throw new Error("Document path requires and id");
    }

    return docPath;
  }

  // == Read operations ==
  /**
   * get a single document by its path properties
   * - must include id
   */
  async get(props: PPT & { id: ID }): Promise<T | null> {
    return this._dataService.document<T>(this._documentPath(props));
  }

  /**
   * Find all documents in a collection
   * - optionally filtered
   */
  async find(props: PPT, queryFn?: QueryFn): Promise<T[]> {
    return this._dataService.query<T>(this._collectionPath(props), queryFn);
  }

  /**
   * Count documents in a collection
   */
  async count(props: PPT, queryFn?: QueryFn): Promise<number> {
    return this._dataService.count(this._collectionPath(props), queryFn);
  }

  /**
   * Find multiple docs by their Ids
   * - Auto-chunks into batches of <N> to respect firestore's `in` query limit
   */
  async findByIds(props: PPT, ids: ID[]): Promise<T[]> {
    const CHUNK_SIZE = 20;
    const results: T[] = [];

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      const chunkResults = await this._dataService.query<T>(
        this._collectionPath(props),
        (ref) => ({ ...ref, where: ["id", "in", chunk] }), // simplified
      );
      results.push(...chunkResults);
    }

    return results;
  }

  // == Write operations ==
  /** create new document (sets the full object) */
  async create(props: PPT & { id: ID }, data: T): Promise<void> {
    return this._dataService.set(this._documentPath(props), data);
  }

  /** save (upsert) a document */
  async save(props: PPT & { id: ID }, data: T): Promise<void> {
    return this._dataService.set(this._documentPath(props), data);
  }

  /** partial update of specific fields */
  async update(props: PPT & { id: ID }, data: Partial<T>): Promise<void> {
    return this._dataService.update(this._documentPath(props), data);
  }

  /** delete a document */
  async delete(props: PPT & { id: ID }): Promise<void> {
    return this._dataService.delete(this._documentPath(props));
  }

  // == Atomic operations ==
  async increment(
    props: PPT & { id: ID },
    field: keyof T & string,
    amount: number,
  ): Promise<void> {
    return this._dataService.increment(
      this._documentPath(props),
      field,
      amount,
    );
  }

  async arrayUnion(
    props: PPT & { id: ID },
    field: keyof T & string,
    values: unknown[],
  ): Promise<void> {
    return this._dataService.arrayUnion(
      this._documentPath(props),
      field,
      values,
    );
  }

  async arrayRemove(
    props: PPT & { id: ID },
    field: keyof T & string,
    values: unknown[],
  ): Promise<void> {
    return this._dataService.arrayRemove(
      this._documentPath(props),
      field,
      values,
    );
  }
}
