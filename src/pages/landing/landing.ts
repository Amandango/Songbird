import { Component, Input, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { Login } from '../../models/login';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { TabsPage } from '../tabs/tabs';
import { Users } from '../../models/users';
import { RegistrationPage } from '../registration/registration';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})

export class LandingPage {

  public loginModel: Login;
  public loginForm: boolean = true;
  public registerForm: boolean = false;
  public users: Users;
  public confirmPassword: string;
  public toast: boolean;
  public loginInfo: Object;
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.loginModel = new Login();
    this.users = new Users();
    this.loginModel.email = this.navParams.get('email');
    this.loginModel.password = this.navParams.get('password')
    this.toast = this.navParams.get('toast');
    this.loader = this.loadingCtrl.create({
      content: "Logging in..."
    });

    console.log(this.loginModel.email);

    if (localStorage.getItem("Token")) {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  ionViewWillEnter() {
    if (this.toast == true) {
      this.presentToast()
    }
  }

  login() {
    this.loader.present().then(result => {
      this.http.post(this.getBaseUrl.getBaseUrl() + "/login", {
        email: this.loginModel.email,
        password: this.loginModel.password
      })
        .subscribe(
          result => {
            var Usertoken = result.json();
            localStorage.setItem("Token", Usertoken.token);
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.popToRoot();
            this.loader.dismiss();
          },
          error => {
            console.log(error);
            this.loader.dismiss();
          }
        );
    })
    .catch(err => {
      console.log(err);
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Thanks for joining the Songbird community! Login to get started',
      duration: 3000,
      position: 'top',
      cssClass: "toast",
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  register() {
    this.navCtrl.push(RegistrationPage);
  }

  submit() {
    this.http.post(this.getBaseUrl.getBaseUrl() + "/register", {
      email: this.users.email,
      password: this.users.password,
      firstname: this.users.firstname,
      lastname: this.users.lastname,
    })
      .subscribe(
        result => {
          console.log(result);

          this.loginForm = true;
          this.registerForm = false;
          this.loginModel.email = this.users.email;
          this.loginModel.password = this.users.password;
          this.presentToast();
        },
        error => {
          console.log(error);
        }
      );
  }

  navToLanding() {
    this.registerForm = false;
    this.loginForm = true;
  }

}