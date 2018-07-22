import { Component, Input, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController} from 'ionic-angular';
import { Login } from '../../models/login';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { TabsPage } from '../tabs/tabs';
import { Users } from '../../models/users';
import { LandingPage } from '../landing/landing';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})

export class RegistrationPage {

  public loginModel: Login;
  public loginForm: boolean = true;
  public registerForm: boolean = false;
  public users: Users;
  public confirmPassword: string;
  public toast: boolean
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.loginModel = new Login();
    this.users = new Users();
    this.toast = false;
    this.loader = this.loadingCtrl.create({
      content: "Registering..."
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Thanks for registering! Login to get started',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  register() {
  }

  submit() {
    this.loader.present().then( result => {
      this.http.post(this.getBaseUrl.getBaseUrl() + "/register", {
        email: this.users.email,
        password: this.users.password,
        firstname: this.users.firstname,
        lastname: this.users.lastname, 
      })
        .subscribe(
          result => {
            console.log(result);
            this.loader.dismiss();
  
            this.navCtrl.push(LandingPage, {
              email: this.users.email,
              password: this.users.password,
              toast: true
            })
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

  back() {
    this.navCtrl.popToRoot();

  }

}