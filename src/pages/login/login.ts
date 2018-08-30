import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { ScreenSaverPage } from '../screen-saver/screen-saver';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credencial: any = {};

  constructor(public dataServiceProvider: DataServiceProvider, public loadingProvider: LoadingProvider, public faceServiceProvider: FaceServiceProvider, public auth: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  login() {
    this.loadingProvider.onLoading();
    this.auth.Signin(this.credencial).then(res => {
      let data: any = res;
      window.localStorage.setItem('token', data.token);
      let user: any = this.auth.Uesr();
      this.faceServiceProvider.CreatePersonGroup(user.schoolid, { name: user.schoolid, userData: user.schoolid }).then(res => {
        this.loadingProvider.dismiss();
        this.navCtrl.setRoot(ScreenSaverPage);
      }).catch(err => {
        this.loadingProvider.dismiss();
        this.navCtrl.setRoot(ScreenSaverPage);
      });
    }).catch(err => {
      this.loadingProvider.dismiss();
      this.dataServiceProvider.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    });
  }

}
