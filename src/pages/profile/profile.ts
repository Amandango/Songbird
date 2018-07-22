import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { Users } from '../../models/users';
import { LandingPage } from '../landing/landing';
import {App} from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public currentUser: Users;
  public lottieLoadingConfig: Object;
  public loading: boolean;
  public failed: boolean;

  private animation: any;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
    public app: App) {

    this.currentUser = new Users();
    this.currentUser.firstname = "";
    this.currentUser.lastname = "";
    this.currentUser.email = "";
    this.loading = false;
    this.failed = false;

    this.lottieLoadingConfig = {
      path: "assets/animations/loading2.json",
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.animation = anim;
  }

  swipeEvent(e) {
    if (e.direction == '2') {
      this.navCtrl.parent.select(1);
    }
  }

  ionViewWillEnter() {
    this.getUserInfo();
  }
  getUserInfo() {
    this.loading = true;
    this.failed = false;
    this.http.get(this.getBaseUrl.getBaseUrl() + "/User?jwt=" + localStorage.getItem("Token"), {
    })
      .subscribe(
        result => {
          this.loading = false;
          this.failed = false;
          console.log(result);
          this.currentUser = result.json().user;
        },
        error => {
          this.loading = false;
          this.failed = true;
          console.log(error);
        }
      );
  }

  logout() {
    this.app.getRootNav().setRoot(LandingPage);
    this.navCtrl.popToRoot();
    localStorage.removeItem("Token");
  }
}
