import {Component} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {setState} from "./state.actions";
import {Observable} from "rxjs";
import { KattService } from '../katt.service';

@Component({
    selector: 'app-ngrx',
    templateUrl: './ngrx.component.html',
    styleUrls: ['./ngrx.component.scss']
})
export class NgrxComponent {
    state$!: Observable<string>;
    stateValue!: string;
    numbers!: number[];
    imageData!: Blob;

    constructor(private store: Store<{ state: string }>, private kattService: KattService) {
        this.state$ = store.select('state');
    }

    ngOnInit(): void {
        this.setState('');

        this.state$.subscribe(value => {
            console.log(value);
            this.stateValue = value;
        });
    }

    setState(stateVal: string): void {
        this.store.dispatch(setState({ stateVal: stateVal }));

        if (stateVal === 'otherStuff') {
            this.numbers = Array.from({length: 40}, () => Math.floor(Math.random() * 40));
        }
    }

    getCat(status: number): void {
        this.kattService.getCat(status).subscribe((data) => {
            this.imageData = data;
        });
    }
}
