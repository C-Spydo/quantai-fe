import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = `${environment.baseUrl}`;


  constructor(private http: HttpClient) {}

  startChat(payload: any): Observable<any> {
    return this.http.post<{ data: any }>(`${this.apiUrl}/start-chat`, payload).pipe(
      map(response => response.data) 
    );
  }

}
