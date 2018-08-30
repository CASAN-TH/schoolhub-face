import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [MessageComponent],
	imports: [IonicModule],
	exports: [MessageComponent]
})
export class ComponentsModule {}
