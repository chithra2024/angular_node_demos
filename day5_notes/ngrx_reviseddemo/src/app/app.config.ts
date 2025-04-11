import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { postReducer } from './state/post.reducer';
import { provideEffects } from '@ngrx/effects';
import { PostEffects } from './state/post.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ posts: postReducer }),
    provideEffects([PostEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
