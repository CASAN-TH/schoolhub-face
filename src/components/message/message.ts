import { Component, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: 'message.html'
})
export class MessageComponent {
  @Input() type: string = '';
  @Input() message: string = '';

  constructor() {

  }

}
