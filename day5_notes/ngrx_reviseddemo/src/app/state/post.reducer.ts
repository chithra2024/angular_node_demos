import { createReducer, on } from '@ngrx/store';
import { loadPosts, loadPostsSuccess, loadPostsFailure } from './post.actions';
import { Post } from './post.model';

export interface PostState {
  posts: Post[];
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  error: null
};
export const postReducer = createReducer(
    initialState,
    on(loadPosts, state => ({ ...state })),
    on(loadPostsSuccess, (state, { posts }) => ({ ...state, posts })),
    on(loadPostsFailure, (state, { error }) => ({ ...state, error }))
  );
  