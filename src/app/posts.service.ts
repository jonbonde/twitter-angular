import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, mergeMap, of, tap, throwError } from 'rxjs';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    const url = `${this.baseUrl}/posts?order=id.desc&select=*,image:images(image_path),user:users(username)`;
    return this.http.get<Post[]>(url);
  }

  getPostsByUserId(id: number): Observable<Post[]> {
    const url = `${this.baseUrl}/posts?select=*,user:users(username),image:images(image_path)&user_id=eq.${id}&order=id.desc`;
    return this.http.get<Post[]>(url);
  }

  newPost(postData: { body: string, user_id: number, image_id: number }): Observable<Post> {
    const url = `${this.baseUrl}/posts?select=*,user:users(username),image:images(image_path)`;
    return this.http.post<Post>(url, postData, { headers: { Prefer: 'return=representation', Accept: 'application/vnd.pgrst.object+json' } }).pipe();
  }

  likePost(id: number): Observable<Post> {
    const url = `${this.baseUrl}/rpc/like_post?select=*,user:users(username),image:images(image_path)`;
    return this.http.post<Post>(
      url, { params: { id_param: id } }
    );
  }

  repostPost(id: number): Observable<Post> {
    const url = `${this.baseUrl}/rpc/repost_post?select=*,user:users(username),image:images(image_path)`;
    return this.http.post<Post>(
      url, { params: { id_param: id } }
    );
  }

  deletePost(id: number): Observable<Post> {
    const url = `${this.baseUrl}/posts?id=eq.${id}`;
    return this.http.delete<Post>(
      url, { headers: { Prefer: "return=representation", Accept: 'application/vnd.pgrst.object+json' } }
    );
  }
}
