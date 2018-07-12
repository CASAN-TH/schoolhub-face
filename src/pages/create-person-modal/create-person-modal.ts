import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';

@IonicPage()
@Component({
  selector: 'page-create-person-modal',
  templateUrl: 'create-person-modal.html',
})
export class CreatePersonModalPage {
  personData: any = {};

  constructor(public attendantServiceProvider: AttendantServiceProvider, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  check() {
    this.attendantServiceProvider.Check(this.personData.userData).then(res => {
      let data: any = res;
      this.personData.name = data.data.firstname + ' ' + data.data.lastname;
    }).catch(err => {
      alert('ไม่พบข้อมูล');
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.viewCtrl.dismiss(this.personData);
  }

}
