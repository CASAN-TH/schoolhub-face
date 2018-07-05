import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CreatePersonModalPage } from '../create-person-modal/create-person-modal';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { AddFacePage } from '../add-face/add-face';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-person-group-detail',
  templateUrl: 'person-group-detail.html',
})
export class PersonGroupDetailPage {
  personGroup: any = {};
  persons: any;
  constructor(public auth: AuthServiceProvider, public faceServiceProvider: FaceServiceProvider, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.personGroup.personGroupId = this.auth.Uesr().schoolid;
    this.getListPerson(this.personGroup.personGroupId);
  }

  ionViewDidLoad() {

  }

  getListPerson(personGroupId) {
    this.faceServiceProvider.GetListPerson(personGroupId).then(data => {
      console.log(data);
      this.persons = data;
    }).catch(err => {
      console.log(err);
    });
  }

  createPerson() {
    let modal = this.modalCtrl.create(CreatePersonModalPage, {}, { enableBackdropDismiss: false });
    modal.onDidDismiss(res => {
      if (res) {
        this.faceServiceProvider.CreatePerson(this.personGroup.personGroupId, res).then(data => {
          let person: any = data;
          let modal2 = this.modalCtrl.create(AddFacePage, {}, { enableBackdropDismiss: false });
          modal2.onDidDismiss(res2 => {
            if (res2) {
              res2.forEach(face => {
                this.faceServiceProvider.AddPersonFaceStream(this.personGroup.personGroupId, person.personId, face).then(data => {
                  console.log(data);
                }).catch(err => {
                  console.log(err);
                });
              });

              this.getListPerson(this.personGroup.personGroupId);
            }
          });
          modal2.present();
        }).catch(err => {
          console.log(err);
        });
      }
    });
    modal.present();
  }

  train() {
    this.faceServiceProvider.TrainPersonGroup(this.personGroup.personGroupId).then(data => {
      this.getStatusRecuring();
    }).catch(err => {
      console.log(err);
    });
  }

  getStatusRecuring() {
    this.faceServiceProvider.GetPersonGroupTrainingStatus(this.personGroup.personGroupId).then(res => {
      let data: any = res;
      if (data.status === 'running') {
        this.getStatusRecuring();
      }
      else {
        console.log(data.status);
        if (data.status === 'succeeded') {

        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

}
