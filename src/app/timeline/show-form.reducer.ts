import { createReducer, on } from "@ngrx/store";
import { changeState } from "./show-form.actions";

export const initialState = false;

export const showFormReducer = createReducer(
    initialState,
    on(changeState, (state) => !state)
);