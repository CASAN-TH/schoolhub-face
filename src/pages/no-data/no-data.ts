import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-no-data',
  templateUrl: 'no-data.html',
})
export class NoDataPage {
  face: any;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.face = navParams.get('face');
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.dismiss();
    }, 2000);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
