import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, mergeMap, of, tap, throwError } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<User[]>(url);
  }

  searchUsers(search: string): Observable<User[]> {
    const url = `${this.baseUrl}/users?username=ilike.*${search}*`;
    return this.http.get<User[]>(url);
  }

  getUser(username: string | null): Observable<User> {
    const url = `${this.baseUrl}/users?username=eq.${username}`;
    return this.http.get<User>(url, { headers: { Prefer: "return=representation", Accept: 'application/vnd.pgrst.object+json' } }).pipe(
      catchError((error) => {
        if (error.status === 406) {
          console.log("hallo");
          return throwError("You must be logged in to make a post");
        } else {
          return throwError("An error occurred while creating post.");
        }
      })
    );
  }

  getUserId(username: string): Observable<number> {
    const url = `${this.baseUrl}/rpc/get_user_id`;
    return this.http.get<number>(url, { params: { username_param: username } });
  }

  registerNew(userData: { username: string, email: string, password: string }): Observable<User> {
    const url = `${this.baseUrl}/users`;
    this.getUsers;
    return this.http.post<User>(url, userData, { headers: { Prefer: 'return=representation', Accept: 'application/vnd.pgrst.object+json' } }).pipe(
      catchError((error) => {
        if (error.status === 409) {
          return throwError("Username or email already exists");
        } else {
          return throwError('An error occurred while registering the user.');
        }
      })
    );
  }

  saveBio(userData: { bio: string }, id: number): Observable<User> {
    const url = `${this.baseUrl}/users?id=eq.${id}`;
    return this.http.patch<User>(url, userData, { headers: { Prefer: 'return=representation', Accept: 'application/vnd.pgrst.object+json' } });
  }

  login(username: string, password: string): Observable<User> {
    const url = `${this.baseUrl}/rpc/login`;
    return this.http.post<User>(
      url, { username_param: username, password_param: password }
    );
  }

  private loginCompletedSource = new Subject<void>();
  loginCompleted$ = this.loginCompletedSource.asObservable();

  loginCompleted() {
    this.loginCompletedSource.next();
  }

  private logoutCompletedSource = new Subject<void>();
  logoutCompleted$ = this.logoutCompletedSource.asObservable();

  logoutCompleted() {
    this.logoutCompletedSource.next();
  }
}
