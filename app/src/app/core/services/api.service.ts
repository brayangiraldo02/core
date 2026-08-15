import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLBASE } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.authService.accessToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${URLBASE}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  getBlob(endpoint: string): Observable<Blob> {
    let headers = new HttpHeaders();
    const token = this.authService.accessToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${URLBASE}${endpoint}`, {
      headers: headers,
      responseType: 'blob',
    });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${URLBASE}${endpoint}`, body, {
      headers: this.getHeaders(),
    });
  }

  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    let headers = new HttpHeaders();
    const token = this.authService.accessToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<T>(`${URLBASE}${endpoint}`, formData, {
      headers: headers,
    });
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${URLBASE}${endpoint}`, body, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${URLBASE}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
