import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';

@IonicPage()
@Component({
  selector: 'page-nfc',
  templateUrl: 'nfc.html',
})
export class NfcPage {
  enableBtn: boolean = true;
  enableSignal: boolean = false;
  constructor(private nfc: NFC, private ndef: Ndef, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  startNFC() {
    this.enableBtn = false;
    this.enableSignal = true;
    if (this.nfc.enabled()) {
      this.nfc.addNdefListener(() => {
      }, (err) => {
        this.enableSignal = false;
        this.enableBtn = true;
        alert(JSON.stringify(err));
      }).subscribe((event) => {
        alert(JSON.stringify(event.tag));
        alert(JSON.stringify('id: ' + this.nfc.bytesToHexString(event.tag.id)));
      });
    } else {
      this.enableSignal = false;
      this.enableBtn = true;
      alert('ไม่ได้เปิด NFC');
    }
  }

}
