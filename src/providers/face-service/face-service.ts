import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class FaceServiceProvider {
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '46547dfcc3d3423c94cce3949093462b'
  });
  uriBase = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0';

  constructor(public http: HttpClient) {

  }

  GetListPersonGroup() {
    return this.http.get(this.uriBase + '/persongroups?top=1000', { headers: this.headers }).toPromise();
  }

  CreatePersonGroup(personGroupId: string, body: any) {
    return this.http.put(this.uriBase + '/persongroups/' + personGroupId, body, { headers: this.headers }).toPromise();
  }

}
