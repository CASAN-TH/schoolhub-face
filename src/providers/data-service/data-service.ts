import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';

@Injectable()
export class DataServiceProvider {
  messageType: string = '';
  message: string = '';
  constructor(public http: HttpClient, public app: App) {
    app.viewWillEnter.subscribe(() => {
      this.messageType = '';
      this.message = '';
    });
  }

  error(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  success(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warning(message) {
    this.messageType = 'warning';
    this.message = message;
  }

  info(message) {
    this.messageType = 'info';
    this.message = message;
  }


}
