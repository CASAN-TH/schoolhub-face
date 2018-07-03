import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonGroupDetailPage } from './person-group-detail';

@NgModule({
  declarations: [
    PersonGroupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonGroupDetailPage),
  ],
})
export class PersonGroupDetailPageModule {}
