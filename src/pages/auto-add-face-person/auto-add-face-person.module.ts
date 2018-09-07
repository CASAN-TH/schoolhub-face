import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutoAddFacePersonPage } from './auto-add-face-person';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AutoAddFacePersonPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AutoAddFacePersonPage),
  ],
})
export class AutoAddFacePersonPageModule {}
