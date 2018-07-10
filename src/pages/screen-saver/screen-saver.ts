import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PersonGroupDetailPage } from '../person-group-detail/person-group-detail';
import { TakePhotoPage } from '../take-photo/take-photo';
import { NfcPage } from '../nfc/nfc';

/**
 * Generated class for the ScreenSaverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})
export class ScreenSaverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  openNFC(){
    this.navCtrl.push(NfcPage);
  }

  openHome() {
    this.navCtrl.push(HomePage);
  }

  logout() {
    window.localStorage.removeItem('token');
    this.navCtrl.setRoot(LoginPage);
  }

  openPagePersonGroupDetail() {
    this.navCtrl.push(TakePhotoPage);
  }

}
