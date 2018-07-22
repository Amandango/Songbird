import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { LogPage } from '../log/log';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = HomePage;
  tab3Root = LogPage;

  constructor(
  ) {

  }
}
