import { createAction, props } from "@ngrx/store";

export const setAccount = createAction('Komla', props<{ accountVal: string }>());