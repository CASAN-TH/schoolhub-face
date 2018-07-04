import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AttendantServiceProvider {
  baseUrl: string = 'https://school-hub-api.herokuapp.com/api/time-attendance';
  constructor(public http: HttpClient) {

  }
  private authorizationHeader() {
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return headers;
  }


  Checkin(body: any) {
    return this.http.post(this.baseUrl, body, { headers: this.authorizationHeader() }).toPromise();
  }

}
