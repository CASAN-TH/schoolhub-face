import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create-person-modal',
  templateUrl: 'create-person-modal.html',
})
export class CreatePersonModalPage {
  personData: any = {};

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.viewCtrl.dismiss(this.personData);
  }

}
