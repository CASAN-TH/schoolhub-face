import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthServiceProvider {
  jwt: JwtHelper = new JwtHelper();
  constructor(public http: HttpClient) {

  }

  header() {
    let headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return { headers: headers };
  }

  Signin(body: any) {
    return this.http.post('https://school-hub-api.herokuapp.com/api/auth/signin', body, this.header()).toPromise();
  }

  authenticated() {
    return tokenNotExpired();
  }

  Uesr() {
    if (this.authenticated()) {
      return this.jwt.decodeToken(window.localStorage.getItem('token'))
    } else {
      return null;
    }
  }
}
