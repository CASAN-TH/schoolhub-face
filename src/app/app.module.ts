import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FaceServiceProvider } from '../providers/face-service/face-service';
import { SettingGroupPage } from '../pages/setting-group/setting-group';
import { HttpClientModule  } from '@angular/common/http';
import { PersonGroupDetailPage } from '../pages/person-group-detail/person-group-detail';
import { CreatePersonModalPage } from '../pages/create-person-modal/create-person-modal';
import { AddFacePage } from '../pages/add-face/add-face';
import { LoginPage } from '../pages/login/login';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AttendantServiceProvider } from '../providers/attendant-service/attendant-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingGroupPage,
    PersonGroupDetailPage,
    CreatePersonModalPage,
    AddFacePage,
    LoginPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingGroupPage,
    PersonGroupDetailPage,
    CreatePersonModalPage,
    AddFacePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FaceServiceProvider,
    AuthServiceProvider,
    AttendantServiceProvider
  ]
})
export class AppModule {}
