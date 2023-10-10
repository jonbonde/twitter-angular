import {createAction, props} from "@ngrx/store";

export const changePostState = createAction('[Timeline Component] ChangePostState');
export const changeCommentsState = createAction('[Timeline Component] ChangeCommentsState', props<{ postId: number }>());