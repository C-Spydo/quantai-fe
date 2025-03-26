import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  signIn(userData): Observable<any> {
    return this.http.post<{ data: any }>(`${this.baseUrl}/api/auth/google`, userData).pipe(
      map(response => response.data) 
    );
  }

  signInWithEmail(userData): Observable<any> {
    return this.http.post<{ data: any }>(`${this.baseUrl}/api/login`, userData).pipe(
      map(response => response.data) 
    );
  }

  signUpWithEmail(userData): Observable<any> {
    return this.http.post<{ data: any }>(`${this.baseUrl}/api/register`, userData).pipe(
      map(response => response.data) 
    );
  }

  getDashboard(): Observable<any> {
    let user_id = localStorage.getItem('tubenotes_id');
    return this.http.get<{ data: any }>(`${this.baseUrl}/dashboard/${user_id}`).pipe(
      map((response) => response.data)
    );
  }

}
