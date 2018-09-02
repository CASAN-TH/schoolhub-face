import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})
export class ScreenSaverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  openNFC() {
    this.navCtrl.push('NfcPage');
  }

  openHome() {
    this.navCtrl.push('AttendancePage');
  }

  logout() {
    window.localStorage.removeItem('token');
    this.navCtrl.setRoot('LoginPage');
  }

  openPagePersonGroupDetail() {
    this.navCtrl.push('TakePhotoPage');
  }

}
