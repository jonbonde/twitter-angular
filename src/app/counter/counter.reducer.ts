import {createReducer, on} from "@ngrx/store";
import { increment, decrement, reset, change } from "./counter.actions";

export const initialState = false;

export const counterReducer = createReducer(
    initialState,
    // on(increment, (state) => state + 1),
    // on(decrement, (state) => state - 1),
    // on(reset, (state) => 0),
    on(change, (state) => !state)
);