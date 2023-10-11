import { createReducer, on } from "@ngrx/store";
import { setState } from "./state.actions";

export const initialState: string = '';

export const stateReducer = createReducer(
    initialState,
    on(setState, (state, { stateVal }) => stateVal)
);