import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  private ip: string;

  constructor(private http: HttpClient) { 
    this.ip = '';
  }

  public getIPAddress(): Observable<any> {
    return this.http.get("http://api.ipify.org/?format=json");
  }
}
