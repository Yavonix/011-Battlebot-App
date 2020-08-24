import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  url:string = "";

  constructor(private iab: InAppBrowser, private router:Router) {}

  openBlank(url) {
    this.iab.create(url, '_system');
  }

  chat() {
    this.router.navigateByUrl('tabs/test');
  }

  control() {
    this.router.navigateByUrl('tabs/bot');
  }
}
