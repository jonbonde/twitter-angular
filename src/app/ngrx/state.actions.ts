import { createAction, props } from "@ngrx/store";

export const setState = createAction('jonas', props<{ stateVal: string }>());