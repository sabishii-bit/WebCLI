import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackEndApiService {

  postHeaders: HttpHeaders = new HttpHeaders

  constructor(private http: HttpClient) {
    this.postHeaders.set('Method', 'POST');
    this.postHeaders.set('Content-Type', 'JSON');
  }

  // Localhost for testing
  public apiConnect(url: string, tag: string): Observable<any> {
    return this.http.post<any>('https://ngz8cohn97.execute-api.us-west-1.amazonaws.com/dev/webscraper', {'URL': url, 'TAG': tag});
  }

  public apiLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:5000/login', {'Username': username, 'Password': password})
  }
}
