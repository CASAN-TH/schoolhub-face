import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class FaceServiceProvider {
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '46547dfcc3d3423c94cce3949093462b'
  });

  headersStream: any = new HttpHeaders({
    'Content-Type': 'application/octet-stream',
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

  makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  DetectStream(body) {

    var payload = this.makeblob(body);

    return this.http.post(this.uriBase + '/detect', payload, { headers: this.headersStream }).toPromise();
  }

  Identify(body) {
    return this.http.post(this.uriBase + '/identify', body, { headers: this.headers }).toPromise();
  }

  GetPerson(personGroupId: string, personId: string) {
    return this.http.get(this.uriBase + '/persongroups/' + personGroupId + '/persons/' + personId, { headers: this.headers }).toPromise();
  }

  PushFaceIds(faces: any) {
    let faceIDs: any = [];
    faces.forEach(face => {
      faceIDs.push(face.faceId);
    });
    return new Promise((resove, reject) => {
      resove(faceIDs);
    })
  }

}
