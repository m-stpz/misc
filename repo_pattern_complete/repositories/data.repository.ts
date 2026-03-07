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
    private readonly _modelClass: new () => T,
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

  // == Write operations ==
}
