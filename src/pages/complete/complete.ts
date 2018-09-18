import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-complete",
  templateUrl: "complete.html"
})
export class CompletePage {
  //person: any = {};
  face: any;
  msg: any = "";
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    //this.person = navParams.get('person');
    this.face = navParams.get("face");
    this.msg = navParams.get("msg");
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
