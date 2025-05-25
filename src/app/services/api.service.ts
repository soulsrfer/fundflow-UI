import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl; // replace this with your actual backend base URL

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      params: new HttpParams({ fromObject: params }),
      headers: headers
    });
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers });
  }
}
