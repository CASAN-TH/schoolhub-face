import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DuplicatePersonGroupPage } from './duplicate-person-group';

@NgModule({
  declarations: [
    DuplicatePersonGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(DuplicatePersonGroupPage),
  ],
})
export class DuplicatePersonGroupPageModule {}
