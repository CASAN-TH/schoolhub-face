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
import { CompletePage } from '../pages/complete/complete';
import { ScreenSaverPage } from '../pages/screen-saver/screen-saver';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { MessageComponent } from '../components/message/message';
import { NoDataPage } from '../pages/no-data/no-data';
import { TakePhotoPage } from '../pages/take-photo/take-photo';
import { CameraPreview } from '@ionic-native/camera-preview';
import { NfcPage } from '../pages/nfc/nfc';
import { NFC, Ndef } from '@ionic-native/nfc';
import { LoadingProvider } from '../providers/loading/loading';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingGroupPage,
    PersonGroupDetailPage,
    CreatePersonModalPage,
    AddFacePage,
    LoginPage,
    CompletePage,
    ScreenSaverPage,
    MessageComponent,
    NoDataPage,
    TakePhotoPage,
    NfcPage
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
    LoginPage,
    CompletePage,
    ScreenSaverPage,
    MessageComponent,
    NoDataPage,
    TakePhotoPage,
    NfcPage
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
    LoadingProvider
  ]
})
export class AppModule {}
