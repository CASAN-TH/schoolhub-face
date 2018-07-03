import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CreatePersonModalPage } from '../create-person-modal/create-person-modal';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { AddFacePage } from '../add-face/add-face';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-person-group-detail',
  templateUrl: 'person-group-detail.html',
})
export class PersonGroupDetailPage {
  personGroup: any = {};
  persons: any;
  constructor(public faceServiceProvider: FaceServiceProvider, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.personGroup = navParams.get('personGroup');
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
                let storageRef = firebase.storage().ref();
                const filename = Math.floor(Date.now() / 1000);
                const imageRef = storageRef.child(`images/${filename}.jpg`);
                imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
                  imageRef.getDownloadURL().then(url => {
                    this.faceServiceProvider.AddPersonFace(this.personGroup.personGroupId, person.personId, { url: url }).then(data => {
                      console.log(data);
                    }).catch(err => {
                      console.log(err);
                    });
                  }).catch(err => {
                    console.log(err);
                  });
                });
              });
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
