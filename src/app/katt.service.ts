import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, mergeMap, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KattService {

  constructor(private http: HttpClient) { }

  getCat(status: number): Observable<Blob> {
    

    return this.http.get<Blob>(`https://http.cat/${status}.jpg`);
  }
}
