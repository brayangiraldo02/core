import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { URLBASE } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ErrorHandlerService, RequestOptions } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);

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

  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(`${URLBASE}${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }

  getBlob(endpoint: string, options?: RequestOptions): Observable<Blob> {
    let headers = new HttpHeaders();
    const token = this.authService.accessToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .get(`${URLBASE}${endpoint}`, {
        headers: headers,
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }

  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(`${URLBASE}${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }

  postFormData<T>(endpoint: string, formData: FormData, options?: RequestOptions): Observable<T> {
    let headers = new HttpHeaders();
    const token = this.authService.accessToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http
      .post<T>(`${URLBASE}${endpoint}`, formData, {
        headers: headers,
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }

  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(`${URLBASE}${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${URLBASE}${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.errorHandlerService.handleError(error, options)));
  }
}
