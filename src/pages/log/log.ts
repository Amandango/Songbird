import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { Texts } from '../../models/texts';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-log',
  templateUrl: 'log.html'
})
export class LogPage {

  audioList: any[] = [];
  public allTexts: Array<Texts> = [];
  public allWeekTexts: Texts[] = [];
  public lottieLoadingConfig: Object;
  public lottieFailedConfig: Object;
  public loading: boolean;
  public failed: boolean;
  public truncating: boolean;
  public limit: number;
  public streak: number;

  private animation: any;

  constructor(public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
    public nativePageTransitions: NativePageTransitions) {

    this.loading = false;
    this.failed = false;
    this.limit = 40;
    this.truncating = true;
    this.streak = 0;

    this.lottieLoadingConfig = {
      path: "assets/animations/loading2.json",
      autoplay: true,
      loop: true
    };

    this.lottieFailedConfig = {
      path: "assets/animations/failWhale.json",
      autoplay: true,
      loop: true
    };

  }

  handleAnimation(anim: any) {
    this.animation = anim;
  }

  swipeEvent(e) {
    if (e.direction == '4') {
      this.navCtrl.parent.select(1);
    }
  }

  getAudioList() {
    if (localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
    this.getTexts();
  }

  //Gets all recorded moments for user

  getTexts() {
    this.loading = true;
    this.failed = false;
    console.log(localStorage.getItem("Token"));
    this.http.get(this.getBaseUrl.getBaseUrl() + "/getTextsById?jwt=" + localStorage.getItem("Token"), {
    })
      .subscribe(
        result => {
          this.loading = false;
          this.failed = false;
          this.allTexts = result.json();
          console.log(this.allTexts.length);
          console.log(this.allTexts);
          console.log('we got them')

          var sortedTexts = this.allTexts.sort((a: Texts, b: Texts) => {
            if (a.createdOn < b.createdOn) {
              return 1;
            }

            if (a.createdOn > b.createdOn) {
              return -1
            }

            return 0;
          });
        },
        error => {
          console.log(error);
          this.loading = false;
          this.failed = true;
        }
      );
  }

  ionViewWillLeave() {

    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 300,
      slowdownfactor: 1,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 10,
      fixedPixelsTop: 70,
      fixedPixelsBottom: 60
    };

    this.nativePageTransitions.slide(options)
      .then(result => {
        console.log('success' + result);
      })
      .catch(err => {
        console.log(err);
      });

  }

}