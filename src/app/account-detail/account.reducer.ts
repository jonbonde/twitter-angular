import { createReducer, on } from "@ngrx/store";
import { setAccount } from "./account.actions";

export const initialState: string = '';

export const accountReducer = createReducer(
    initialState,
    on(setAccount, (state, { accountVal }) => accountVal)
);