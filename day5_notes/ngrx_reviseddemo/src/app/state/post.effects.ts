import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { loadPosts, loadPostsSuccess, loadPostsFailure } from './post.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Post } from './post.model';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPosts),
      mergeMap(() =>
        this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').pipe(
          map(posts => loadPostsSuccess({ posts })),
          catchError(error => of(loadPostsFailure({ error: error.message })))
        )
      )
    )
  );
}
