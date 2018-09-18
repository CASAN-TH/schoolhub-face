import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'


@Component({
  selector: 'page-screen-saver',
  templateUrl: 'screen-saver.html',
})
export class ScreenSaverPage {

  currentTime : any;
  tickerIn = [6, 7, 8, 14, 15, 16, 22];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewWillEnter(){
    this.tickTime();
  }

  tickTime(){
    this.currentTime = new Date();

    setTimeout(() => {
      if(this.tickerIn.indexOf(new Date().getHours()) > 0){
        //this.navCtrl.setRoot('AttendancePage');
        this.openHome();
      }else{
        this.tickTime();
      }
     
    }, 1000);
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

  openDuplicate() {
    this.navCtrl.push('DuplicatePersonGroupPage');
  }

  openAutoAddFace() {
    this.navCtrl.push('AutoAddFacePersonPage');
  }

}
