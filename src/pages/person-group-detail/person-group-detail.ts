import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-person-group-detail',
  templateUrl: 'person-group-detail.html',
})
export class PersonGroupDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('personGroup'));
  }

  ionViewDidLoad() {
    
  }

}
