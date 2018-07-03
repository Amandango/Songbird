import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController) {

  }

  swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(1);
    }    
  }

}
