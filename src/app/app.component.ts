import { PostsService } from './posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private postsService: PostsService) {}

  ngOnInit() {
    this.errorSubscription = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage
    })
    this.fetchPosts()
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content)
  }

  onFetchPosts() {
    this.fetchPosts()
  }

  onClearPosts() {
    this.postsService.clearPosts().subscribe(() => {
      this.loadedPosts = []
    })
  }

  onHandleError() {
    this.error = null
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts
    }, error => {
      this.isFetching = false
      this.error = error.message
    })
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe()
  }

}
