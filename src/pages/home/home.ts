import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TypePage } from '../type/type';
import { RecorderPage } from '../recorder/recorder';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  clicked: boolean = false;

  constructor(public navCtrl: NavController) {

  }

  mouseDown() {
    this.clicked = true;
  }

  mouseUp() {
    this.clicked = false;
  }

  record() {
    this.navCtrl.push(RecorderPage)
  }

  type() {
    this.navCtrl.push(TypePage)
  }

  navToHome() {
    this.navCtrl.popToRoot()
  }

  swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(2);
    }
    else if(e.direction == '4'){
       this.navCtrl.parent.select(0);
    }
  }

}
