import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePersonGroupModalPage } from './create-person-group-modal';

@NgModule({
  declarations: [
    CreatePersonGroupModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePersonGroupModalPage),
  ],
})
export class CreatePersonGroupModalPageModule {}
