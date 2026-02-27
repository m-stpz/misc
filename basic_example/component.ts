import { Component, Inject } from "@angular/core";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { CounterStore } from "./store";

@Component({
  selector: "app-counter",
  template: `<div class="card">
        <h2>global count: {{ store.count() }}<h2>
        <button (click)="increment()" [disabled]="loading"> 
            {{loading ? "Calculating..." : "Increment via cloud "}}
        </button>
  </div>`,
})
export class CounterComponent {
  private functions = Inject(Functions); // firebase functions sdk
  public store = Inject(CounterStore); // our signal store
  loading = false;

  async increment() {
    this.loading = true;

    // 1. create a reference to the function
    const incrementFn = httpsCallable(this.functions, "incrementCounter");

    try {
      // 2. call the function and pass the current data
      const result = await incrementFn({ currentCount: this.store.count() });

      // 3. update the store with the response
      const data = result.data as { total: number };
      this.store.updateCount(data.total);
    } finally {
      this.loading = false;
    }
  }
}
