import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePersonModalPage } from './create-person-modal';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreatePersonModalPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CreatePersonModalPage)
  ]
})
export class CreatePersonModalPageModule {}
