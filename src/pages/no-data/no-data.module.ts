import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoDataPage } from './no-data';

@NgModule({
  declarations: [
    NoDataPage,
  ],
  imports: [
    IonicPageModule.forChild(NoDataPage),
  ],
})
export class NoDataPageModule {}
