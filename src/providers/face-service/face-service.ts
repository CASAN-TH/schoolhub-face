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

  GetListPerson(personGroupId) {
    return this.http.get(this.uriBase + '/persongroups/' + personGroupId + '/persons?top=1000', { headers: this.headers }).toPromise();
  }

  CreatePerson(personGroupId, body) {
    return this.http.post(this.uriBase + '/persongroups/' + personGroupId + '/persons', body, { headers: this.headers }).toPromise();
  }

  AddPersonFace(personGroupId, personId, body) {
    return this.http.post(this.uriBase + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces', body, { headers: this.headers }).toPromise();
  }

  TrainPersonGroup(personGroupId) {
    return this.http.post(this.uriBase + '/persongroups/' + personGroupId + '/train', {}, { headers: this.headers }).toPromise();
  }

  GetPersonGroupTrainingStatus(personGroupId) {
    return this.http.get(this.uriBase + '/persongroups/' + personGroupId + '/training', { headers: this.headers }).toPromise();
  }

  Detect(body) {
    return this.http.post(this.uriBase + '/detect', body, { headers: this.headers }).toPromise();

  }

}
