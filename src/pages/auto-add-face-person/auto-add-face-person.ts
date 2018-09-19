import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@IonicPage()
@Component({
  selector: 'page-auto-add-face-person',
  templateUrl: 'auto-add-face-person.html',
})
export class AutoAddFacePersonPage {
  public personGroupId: any;
  public cnt: number = 0;
  public checkCnt: number = 0;
  public pg: boolean = false;
  public createBtn: boolean = false;

  constructor(public dataServiceProvider: DataServiceProvider, public faceServiceProvider: FaceServiceProvider, public attendantServiceProvider: AttendantServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  async createPersonGroup() {
    let cfm = window.confirm('ยืนยันการสร้างข้อมูล');
    if (cfm) {
      try {
        this.pg = true;
        this.checkCnt = 0;
        this.createBtn = true;
        this.dataServiceProvider.success('');
        let body = {
          name: this.personGroupId,
          userData: this.personGroupId
        };
        // let res: any = await this.faceServiceProvider.CreatePersonGroup(this.personGroupId, body);
        this.addPersonToPersonGroup();
      } catch (error) {
        this.errHandle(error);
      }
    }
  }

  async addPersonToPersonGroup() {
    try {
      let res: any = await this.attendantServiceProvider.getStudentListFromJson();
      let studentList: Array<any> = res;
      this.cnt = studentList.length;
      studentList.forEach((el, i) => {
        setTimeout(() => {
          this.createPerson(el);
        }, 2000 * i);
      });
    } catch (error) {
      this.errHandle(error);
    }
  }

  async createPerson(el) {
    try {
      console.log(el);
      let personGroupData: any = {
        name: el.firstname + ' ' + el.lastname, // ชื่อเด็ก
        userData: el.citizenid // รหัสบัตรประชาชน
      };

      let res: any = await this.faceServiceProvider.CreatePerson(this.personGroupId, personGroupData);
      el.imgs.forEach((url, i) => {
        setTimeout(() => {
          this.addPersonFace(this.personGroupId, res.personId, url);
        }, 2000 * i);
      });

      this.checkCnt++;
    } catch (error) {
      this.errHandle(error);
    }
  }

  async addPersonFace(personGroupId, personId, url) {
    try {
      let face: any = await this.faceServiceProvider.AddPersonFace(personGroupId, personId, { url: url });
      console.log(face);
    } catch (error) {
      this.errHandle(error);
    }
  }

  async TrainningGroup() {
    try {
      let train: any = await this.faceServiceProvider.TrainPersonGroup(this.personGroupId);
      console.log(train);
    } catch (error) {
      console.log(error);
    }
  }

  errHandle(error) {
    this.dataServiceProvider.error(JSON.stringify(error || error.error));
    this.createBtn = false;
    // this.pg = false;
  }

}
