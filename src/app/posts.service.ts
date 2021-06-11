import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
})

export class PostsService {

  error = new Subject<string>()

  constructor(private http: HttpClient) {}



  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title: title,
      content: content
    }

    this.http.post<{ name: string }>(
      'https://angular-http-practice-c1d0a-default-rtdb.firebaseio.com/posts.json',
      postData,
      {
        observe: 'response'
      }
    ).subscribe(responseData => {
      console.log(responseData.body)
    }, error => {
      this.error.next(error.message)
    })
  }



  fetchPosts() {
    let searchParams = new HttpParams()
    searchParams = searchParams.append('print', 'pretty')
    searchParams = searchParams.append('custom', 'key')

    return this.http
      .get<{[key: string]: Post }>(
        'https://angular-http-practice-c1d0a-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({"Custom-Header": "Hello"}),
          params: searchParams
        }
      )
      .pipe(map(responseData => {
        const posts: Post[] = []
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            posts.push({...responseData[key], id: key })
          }
        }
        return posts
      }),
      catchError(errorResponse => {
        return throwError(errorResponse)
      })
    )
  }



  clearPosts() {
    return this.http.delete(
      'https://angular-http-practice-c1d0a-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }
    ).pipe(tap(event => {
      if (event.type === HttpEventType.Sent) {
        console.log(event)
      }
      if (event.type === HttpEventType.Response) {
        console.log(event.body)
      }
    }))
  }
}
