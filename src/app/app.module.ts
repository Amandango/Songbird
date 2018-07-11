//Components
import { NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

//Pages
import { ProfilePage } from '../pages/profile/profile';
import { LogPage } from '../pages/log/log';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TypePage } from '../pages/type/type';
import { RecorderPage } from '../pages/recorder/recorder';
import { LandingPage } from '../pages/landing/landing';

//Services
import { getBaseUrl } from '../getBaseUrl';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    LogPage,
    HomePage,
    TabsPage,
    TypePage,
    RecorderPage,
    LandingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    LogPage,
    HomePage,
    TabsPage,
    TypePage,
    RecorderPage,
    LandingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    getBaseUrl,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
