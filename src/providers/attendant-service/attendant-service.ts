import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../app/app.constant';

@Injectable()
export class AttendantServiceProvider {
  constructor(public http: HttpClient) {

  }

  private authorizationHeader() {
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return headers;
  }

  UploadImage(body) {
    return this.http.post(Constants.URL + '/api/image', body, { headers: this.authorizationHeader() }).toPromise();
  }

  Checkin(body: any) {
    return this.http.post(Constants.URL + '/api/time-attendance', body, { headers: this.authorizationHeader() }).toPromise();
  }

  Check(id: string) {
    return this.http.get(Constants.URL + '/api/student-school-citizenid/' + id, { headers: this.authorizationHeader() }).toPromise();
  }

  getStudentList() {
    return this.http.post(Constants.URL + '/api/get-student-school', { limit: 999 }, { headers: this.authorizationHeader() }).toPromise();
  }

  getStudentListFromJson() {
    return this.http.get('../../assets/json/1-6.json', { headers: this.authorizationHeader() }).toPromise();
  }

  getStudentImages(citizenid: string) {
    return this.http.post(Constants.URL + '/api/images-citizenid', { citizenid: citizenid }, { headers: this.authorizationHeader() }).toPromise();
  }

}
