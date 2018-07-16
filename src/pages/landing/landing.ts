import { Component, Input, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Login } from '../../models/login';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { TabsPage } from '../tabs/tabs';
import { Users } from '../../models/users';
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

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
  ) {
    this.loginModel = new Login();
    this.users = new Users();
    if (localStorage.getItem("Token")) {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  login() {
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
        },
        error => {
          console.log(error);
        }
      );
  }

  register() {
    this.loginForm = false;
    this.registerForm = true;
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