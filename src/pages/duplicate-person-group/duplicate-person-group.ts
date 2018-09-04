import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';
import { FaceServiceProvider } from '../../providers/face-service/face-service';

@IonicPage()
@Component({
  selector: 'page-duplicate-person-group',
  templateUrl: 'duplicate-person-group.html',
})
export class DuplicatePersonGroupPage {
  public personGroupId: any;
  public cnt: number = 0;
  public checkCnt: number = 0;
  public pg: boolean = false;

  constructor(public faceServiceProvider: FaceServiceProvider, public attendantServiceProvider: AttendantServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.personGroupId = '5b89127e9bcb300014a221fe'; //รหัสโรงเรียนใหม่
  }

  async createPersonGroup() {
    let cfm = window.confirm('ยืนยันการสร้างข้อมูล');
    if (cfm) {
      try {
        this.pg = true;
        let body = {
          name: this.personGroupId,
          userData: this.personGroupId
        };
        let res: any = await this.faceServiceProvider.CreatePersonGroup(this.personGroupId, body);
        this.addPersonToPersonGroup();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async addPersonToPersonGroup() {
    try {
      let students: any = await this.attendantServiceProvider.getStudentList();
      let studentList: Array<any> = students.datas;
      this.cnt = studentList.length;
      studentList.forEach((el, i) => {
        setTimeout(() => {
          this.getImgs(el);
        }, 1000 * i);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getImgs(el) {
    try {
      console.log(el);
      let personGroupData: any = {
        name: el.firstname + ' ' + el.lastname, // ชื่อเด็ก
        userData: el.citizenid // รหัสบัตรประชาชน
      };

      let images: Array<any> = [];
      let imgs: any = await this.attendantServiceProvider.getStudentImages(el.citizenid);
      imgs.datas.forEach(el => {
        images.push(el.image);
      });
      let res: any = await this.faceServiceProvider.CreatePerson(this.personGroupId, personGroupData);
      console.log(res);
      images.forEach(base64 => {
        this.addPersonFace(this.personGroupId, res.personId, base64);
      });

      this.checkCnt++;
      console.log(this.checkCnt);
    } catch (error) {
      console.log(error);
    }
  }

  async addPersonFace(personGroupId, personId, base64) {
    try {
      let face: any = await this.faceServiceProvider.AddPersonFaceStream(personGroupId, personId, base64);
      console.log(face);
    } catch (error) {
      console.log(error);
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

}
