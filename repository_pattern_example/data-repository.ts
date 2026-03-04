import { inject } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
  arrayUnion,
  arrayRemove,
  increment,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

/**
 * - abstract engine
 * - powers entire data layer
 * - handles low-level firebase SDK calls
 * - specific repositories only worry about paths and types
 *
 * T: data model
 * P: path requirements
 *
 * Provides a firebase-free way for components to perform server-side math and array updates
 */
export abstract class DataRepository<T, P> {
  protected firestore = inject(Firestore);

  // child class provides path logic
  constructor(
    protected model: any,
    protected path: any,
    protected dataService: any,
  ) {}

  /**
   * Atomic operations
   * Wraps firebase FieldValues, so components don't need Firebase imports
   */
  readonly atomic = {
    arrayUnion: (value: any) => arrayUnion(value),
    arrayRemove: (value: any) => arrayRemove(value),
    increment: (value: number) => increment(value),
  };

  /**
   * PATH BUILDER: internal engine
   * - Uses the path class logic
   */
  private buildPath(id: string | null, props: P) {
    const pathInstance = new this.path(props);
    return id
      ? `${pathInstance.collectionPath}/${id}`
      : pathInstance.collectionPath;
  }

  /**
   * READ: Watch a single document in real-time
   */
  watch(id: string, props: P): Observable<T> {
    const fullPath = this.buildPath(id, props);
    const docRef = doc(this.firestore, fullPath);
    return docData(docRef, { idField: "id" }) as Observable<T>;
  }

  async save(id: string, data: Partial<T>, props: P): Promise<void> {
    const fullPath = this.buildPath(id, props);
    const docRef = doc(this.firestore, fullPath);
    // setDoc with merge: true acts as an "upsert"
    return setDoc(docRef, data, { merge: true });
  }

  async update(id: string, data: Partial<T>, props: P): Promise<void> {
    const fullPath = this.buildPath(id, props);
    const docRef = doc(this.firestore, fullPath);
    return updateDoc(docRef, data as any);
  }

  async delete(id: string, props: P): Promise<void> {
    const fullPath = this.buildPath(id, props);
    const docRef = doc(this.firestore, fullPath);
    return deleteDoc(docRef);
  }
}
