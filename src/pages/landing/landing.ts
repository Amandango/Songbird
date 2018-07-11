import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Login } from '../../models/login';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})

export class LandingPage {

  public loginModel: Login;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
  ) {
    this.loginModel = new Login();
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
          this.navCtrl.setRoot(HomePage);
          this.navCtrl.popToRoot();
        },
        error => {
          console.log(error);
        }
      );
  }

}