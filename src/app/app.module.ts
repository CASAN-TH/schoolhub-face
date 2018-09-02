import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FaceServiceProvider } from '../providers/face-service/face-service';
import { HttpClientModule  } from '@angular/common/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AttendantServiceProvider } from '../providers/attendant-service/attendant-service';
import { ScreenSaverPage } from '../pages/screen-saver/screen-saver';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { CameraPreview } from '@ionic-native/camera-preview';
import { NFC, Ndef } from '@ionic-native/nfc';
import { LoadingProvider } from '../providers/loading/loading';
import { Network } from '@ionic-native/network';
import { ComponentsModule } from '../components/components.module';
import { AttendancePage } from '../pages/attendance/attendance';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ScreenSaverPage,
    AttendancePage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ScreenSaverPage,
    AttendancePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NFC,
    Ndef,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FaceServiceProvider,
    AuthServiceProvider,
    AttendantServiceProvider,
    DataServiceProvider,
    CameraPreview,
    LoadingProvider,
    Network
  ]
})
export class AppModule {}
