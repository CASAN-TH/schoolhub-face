import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFacePage } from './add-face';

@NgModule({
  declarations: [
    AddFacePage,
  ],
  imports: [
    IonicPageModule.forChild(AddFacePage),
  ],
})
export class AddFacePageModule {}
