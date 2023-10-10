import {createReducer, on} from "@ngrx/store";
import {changeCommentsState, changePostState} from "./show-form.actions";

// export const initialPostState = {
//     post: false,
//     comments: 0
// };

// export type PostState {
//     post: boolean,
//     comments: number
// }

// export const showFormReducer = createReducer(
//     initialPostState,
//     // on(changePostState, (state) => ({ ...state, post: !state.post })),
//     on(changePostState, (state) => ({ post: !state.post, comments: 0 })),
//     on(changeCommentsState, (state) => ({ ...state, comments: state.comments }))
// );

export const initialPostState = false;
export const initialCommentsState = 0;

export const showFormReducer = createReducer(
    initialPostState,
    on(changePostState, (state) => !state),
);

export const showCommentsReducer = createReducer(
    initialCommentsState,
    on(changeCommentsState, (state, { postId }) => postId)
);