import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-type',
  templateUrl: 'type.html'
})
export class TypePage {

  constructor(public navCtrl: NavController) {

  }

  swipeRightEvent() {
    this.navCtrl.popToRoot();
  }


}