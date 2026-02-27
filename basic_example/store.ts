import { signal, Injectable } from "@angular/core";

/**
 * modern angular, we use signal for lightweight store
 * - keeps the ui in sync with the data
 */
@Injectable({ providedIn: "root" })
export class CounterStore {
  private _count = signal<number>(0); // source of truth

  // read-only access for components
  readonly count = this._count.asReadonly();

  updateCount(newVal: number) {
    this._count.set(newVal);
  }
}
