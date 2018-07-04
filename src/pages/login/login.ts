import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { HomePage } from '../home/home';


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
      let user: any = this.auth.Uesr();
      this.faceServiceProvider.CreatePersonGroup(user.schoolid, { name: user.schoolid, userData: user.schoolid }).then(res => {
        this.navCtrl.setRoot(HomePage);
      }).catch(err => {
        this.navCtrl.setRoot(HomePage);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  getProfile() {
    if (this.auth.authenticated()) {
      let user: any = this.auth.Uesr();
      console.log(user);
    }
  }

  logout() {
    window.localStorage.removeItem('token');
  }

}
