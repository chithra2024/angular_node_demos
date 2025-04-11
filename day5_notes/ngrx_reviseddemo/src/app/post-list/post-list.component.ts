import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllPosts, selectPostError } from '../state/post.selectors';
import { loadPosts } from '../state/post.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  private store = inject(Store);
  posts$ = this.store.select(selectAllPosts);
  error$ = this.store.select(selectPostError);

  ngOnInit() {
    this.store.dispatch(loadPosts());
  }
}

