import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendancePage } from './attendance';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AttendancePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AttendancePage),
  ],
})
export class AttendancePageModule {}
