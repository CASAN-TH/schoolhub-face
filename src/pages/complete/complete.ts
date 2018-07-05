import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-complete',
  templateUrl: 'complete.html',
})
export class CompletePage {
  person: any = {};
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.person = navParams.get('person');
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.dismiss();
    }, 5000);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
