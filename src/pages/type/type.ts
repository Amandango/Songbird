import { Component, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { Users } from '../../models/users';
import { Texts } from '../../models/texts';
import { LogPage } from '../log/log';

import { HomePage } from '../home/home';

import * as moment from 'moment';

@Component({
  selector: 'page-type',
  templateUrl: 'type.html'
})
export class TypePage {

  public momentText: String;
  public momentTitle: String;
  public userInfo: Users;
  public text = new Texts();
  public loader: any;

  constructor(public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    this.text.momentText = "";
    this.text.momentTitle = "";
    this.loader = this.loadingCtrl.create({
      content: "Creating your moment..."
    });
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  swipeEvent(e) {
    if (e.direction == '4') {
      this.navCtrl.popToRoot();
    }
  }

  submitMoment() {

    const promise = new Promise((resolve, reject) => {
    });

    this.loader.present().then(result => {

      this.http.get(this.getBaseUrl.getBaseUrl() + "/User?jwt=" + localStorage.getItem("Token"), {
      })
        .subscribe(
          result => {
            this.userInfo = result.json().user;
            Promise.resolve(this.userInfo)
              .then((res) => {
                console.log(res);
                if (this.text.momentTitle.length == 0) {
                  this.text.momentTitle = moment(new Date()).format('ddd MM, YYYY h:mm a');
                }
  
                this.text.userId = this.userInfo.id;
                console.log(this.userInfo.id);
                this.text.createdOn = new Date();
  
                return this.text;
              })
  
              .catch((err) => {
                console.log(err.message);
                this.loader.dismiss();
              })
  
              .then((res) => {
                this.http.post(this.getBaseUrl.getBaseUrl() + "/texts", {
  
                  momentText: this.text.momentText,
                  momentTitle: this.text.momentTitle,
                  createdOn: this.text.createdOn,
                  userId: this.userInfo.id
                })
                  .subscribe(
                    result => {
                      console.log(result);
                      this.navCtrl.popToRoot();
                      this.navCtrl.parent.select(2);
                      this.loader.dismiss();
                    },
                    error => {
                      console.log(error);
                      this.loader.dismiss();
                      this.showAlert('Sorry, could not record your moment. Please contact support for help!')
                    }
                  );
              })
  
              .catch((err) => {
                console.log(err.message);
                this.loader.dismiss();
              })
          })
  
      error => {
        console.log(error);
        this.loader.dismiss();
        this.showAlert('Could not find user. Make sure you are logged in properly');
      }
    }

    )
}
}