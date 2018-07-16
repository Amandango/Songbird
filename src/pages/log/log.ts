import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { getBaseUrl } from '../../getBaseUrl';
import { Texts } from '../../models/texts';

@Component({
  selector: 'page-log',
  templateUrl: 'log.html'
})
export class LogPage {

  audioList: any[] = [];
  public allTexts: Texts[] = [];

  constructor(public navCtrl: NavController,
    public http: Http,
    public getBaseUrl: getBaseUrl) {

  }

  swipeEvent(e) {
    if(e.direction == '4'){
       this.navCtrl.parent.select(1);
    }    
  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
    this.getTexts();
  }

  getTexts(){
    this.http.get(this.getBaseUrl.getBaseUrl() + "/getTextsById?jwt=" + localStorage.getItem("Token"), {
    })
    .subscribe(
      result => {
        this.allTexts = result.json();
        console.log(this.allTexts);
      },
      error => {
        console.log(error);
      }
    );
  }

}
