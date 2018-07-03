import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CreatePersonModalPage } from '../create-person-modal/create-person-modal';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { AddFacePage } from '../add-face/add-face';

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
          let modal2 = this.modalCtrl.create(AddFacePage,{}, { enableBackdropDismiss: false });
          modal2.onDidDismiss(res2 =>{
            if(res2){

            }
          });
          modal2.present();
          //this.getListPerson(this.personGroup.personGroupId);
        }).catch(err => {
          console.log(err);
        });
      }
    });
    modal.present();
  }

}
