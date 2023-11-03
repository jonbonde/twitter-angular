import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, mergeMap, of, tap, throwError } from 'rxjs';
import { Post } from './post';
import { Comment } from "./comment";
import { Like } from './like';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    const url = `${this.baseUrl}/posts?order=id.desc&select=*,image:images(image_path),user:users(username)&limit=2`;
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

  likePost(id: number, post_id: number, user_id: number): Observable<Post> {
    const url = `${this.baseUrl}/rpc/like_post?select=*,user:users(username),image:images(image_path)`;
    return this.http.post<Post>(
      url, { params: { id_param: id, post_id_param: post_id, user_id_param: user_id } }
    );
  }

  likeComment(id: number, user_id: number): Observable<Comment> {
    const url = `${this.baseUrl}/rpc/like_comment?order=likes_count.desc`;
    return this.http.post<Comment>(url, { params: { id_param: id, user_id_param: user_id } })
  }

  repostPost(id: number, post_id: number, user_id: number): Observable<Post> {
    const url = `${this.baseUrl}/rpc/repost_post?select=*,user:users(username),image:images(image_path)`;
    return this.http.post<Post>(
      url, { params: { id_param: id, post_id_param: post_id, user_id_param: user_id } }
    );
  }

  deletePost(id: number): Observable<Post> {
    const url = `${this.baseUrl}/posts?id=eq.${id}`;
    return this.http.delete<Post>(
      url, { headers: { Prefer: "return=representation", Accept: 'application/vnd.pgrst.object+json' } }
    );
  }

  getComments(postId: number): Observable<Comment[]> {
    const url = `${this.baseUrl}/comments?post_id=eq.${postId}&order=likes_count.desc`;
    return this.http.get<Comment[]>(url);
  }

  newComment(commentData: {body: string, post_id: number}): Observable<Comment> {
    const url = `${this.baseUrl}/comments`;
    return this.http.post<Comment>(url, commentData, { headers: { Prefer: 'return=representation', Accept: 'application/vnd.pgrst.object+json' } })
  }

  getLikedPosts(user_id: number): Observable<Like[]> {
    const url = `${this.baseUrl}/likes?user_id=eq.${user_id}`;
    return this.http.get<Like[]>(url);
  }
}
