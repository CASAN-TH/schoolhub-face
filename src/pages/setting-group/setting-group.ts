import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FaceServiceProvider } from '../../providers/face-service/face-service';

@IonicPage()
@Component({
  selector: 'page-setting-group',
  templateUrl: 'setting-group.html',
})
export class SettingGroupPage {

  personGroups: any;
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams, public faceServiceProvider: FaceServiceProvider) {
  }

  ionViewDidLoad() {
    this.getListperson();
  }

  getListperson() {
    this.faceServiceProvider.GetListPersonGroup().then((data) => {
      console.log(data);
      this.personGroups = data;
    }).catch((err) => {
      console.log(err);
    });
  }

  createPersonGroup(){
    let modal = this.modalCtrl.create('CreatePersonGroupModalPage', {}, { enableBackdropDismiss: false });
    modal.onDidDismiss(res => {
      if (res) {
        
      }
    });
    modal.present();
  }

}
