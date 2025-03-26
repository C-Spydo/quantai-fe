import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = `${environment.baseUrl}`;
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  fetchSummaryHistory(): Observable<any> {
    let user_id = localStorage.getItem('tubenotes_id');
    return this.http.get<{ data: any }>(`${this.apiUrl}users/${user_id}/notes`).pipe(
      map((response) => response.data)
    );
  }

  // summariseVideo(searchQuery: string): Observable<any> {
  //   return this.http.get<any>('assets/video-test.json');
  // }

  summariseVideo(title: string): Observable<any> {
    let user_id = localStorage.getItem('tubenotes_id');
    return this.http.get<{ data: any }>(`${this.apiUrl}/notes?query=${title}&user_id=${user_id}`).pipe(
      map((response) => response.data)
    );
  }

  deleteSummary(id: number): Observable<any> {
    return this.http.delete<{ data: any }>(`${this.apiUrl}/notes/${id}`).pipe(
      map((response) => response.data)
    );
  }


}
