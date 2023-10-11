import {Component} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {setState} from "./state.actions";
import {Observable} from "rxjs";

@Component({
    selector: 'app-ngrx',
    templateUrl: './ngrx.component.html',
    styleUrls: ['./ngrx.component.scss']
})
export class NgrxComponent {
    state$!: Observable<string>;
    stateValue!: string;

    constructor(private store: Store<{ state: string }>) {
        this.state$ = store.select('state');
    }

    ngOnInit(): void {
        this.setState('');

        // this.state$.subscribe(value => {
        //     console.log(value);
        //     this.stateValue = value;
        // });
    }

    setState(stateVal: string): void {
        this.store.dispatch(setState({ stateVal: stateVal }));
    }
}
