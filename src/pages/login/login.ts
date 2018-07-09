import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { HomePage } from '../home/home';
import { ScreenSaverPage } from '../screen-saver/screen-saver';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credencial: any = {};

  constructor(public faceServiceProvider: FaceServiceProvider, public auth: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  login() {
    this.auth.Signin(this.credencial).then(res => {
      let data: any = res;
      window.localStorage.setItem('token', data.token);
      console.log(window.localStorage.getItem('token'));
      let user: any = this.auth.Uesr();
      console.log(user);
      this.faceServiceProvider.CreatePersonGroup(user.schoolid, { name: user.schoolid, userData: user.schoolid }).then(res => {
        this.navCtrl.setRoot(ScreenSaverPage);
      }).catch(err => {
        this.navCtrl.setRoot(ScreenSaverPage);
      });
    }).catch(err => {
      console.log(err);
    });
  }

}
