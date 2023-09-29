import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from './image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  upload(data: FormData): Observable<Image> {
    const url = 'http://localhost:9000/move-image.php';
    return this.http.post<Image>(url, data);
  }

  savePath(imageData: { image_path: string }): Observable<Image> {
    const url = `${this.baseUrl}/images`;
    return this.http.post<Image>(url, imageData, { headers: { Prefer: 'return=representation', Accept: 'application/vnd.pgrst.object+json' } }).pipe();
  }

  deleteImage(imageName: FormData): Observable<Image> {
    const url = 'http://localhost:9000/delete-image.php';
    return this.http.post<Image>(url, imageName);
  }

  deletePath(imagePath: string): Observable<Image> {
    const url = `${this.baseUrl}/images?image_path=eq.${imagePath}`;
    return this.http.delete<Image>(url, { headers: { Prefer: "return=representation", Accept: 'application/vnd.pgrst.object+json' } });
  }
}