import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { Users } from '../../models/users';
import { Texts } from '../../models/texts';
import { LogPage } from '../log/log';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-type',
  templateUrl: 'type.html'
})
export class TypePage {

  public momentText: String;
  public momentTitle: String;
  public userInfo: Users;
  public text = new Texts();

  constructor(public navCtrl: NavController,
    public http: Http, 
    public getBaseUrl: getBaseUrl) {
    this.text.momentText = "";
    this.text.momentTitle ="";
  }

  swipeEvent(e) {
    if(e.direction == '4'){
       this.navCtrl.popToRoot();
    }    
  }

  submitMoment(){
    this.http.get(this.getBaseUrl.getBaseUrl() + "/User?jwt=" + localStorage.getItem("Token"),{
      })
      .subscribe(
        result => {
          this.userInfo = result.json().user;
          console.log(this.text.momentText);
          console.log(this.text.momentTitle);
          console.log(this.userInfo.id);
          this.text.userId = this.userInfo.id;
          this.text.createdOn = new Date();
          console.log(this.text);
          
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
            },
            error => {
              console.log(error);
            }
          );

        },
        error => {
          console.log(error);
        }
      );
    }
}