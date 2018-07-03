import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePersonModalPage } from './create-person-modal';

@NgModule({
  declarations: [
    CreatePersonModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePersonModalPage),
  ],
})
export class CreatePersonModalPageModule {}
