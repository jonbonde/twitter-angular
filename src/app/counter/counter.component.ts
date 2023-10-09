import { Component } from '@angular/core';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs';
import { decrement, increment, reset, change } from "./counter.actions";

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
})
export class CounterComponent {
  count$!: Observable<boolean>

  constructor(private store: Store<{ count: boolean }>) {
    this.count$ = store.select('count');
  }

  // increment() {
  //   this.store.dispatch(increment());
  // }
  //
  // decrement() {
  //   this.store.dispatch(decrement());
  // }
  //
  // reset() {
  //   this.store.dispatch(reset());
  // }

  change() {
    this.store.dispatch(change());
  }
}