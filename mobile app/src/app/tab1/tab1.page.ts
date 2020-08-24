import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

// Homepage

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  url:string = "";

  constructor(private iab: InAppBrowser, private router:Router) {}

  // Opens link in browser default
  openBlank(url) {
    this.iab.create(url, '_system');
  }

  // Navigates to chat page
  chat() {
    this.router.navigateByUrl('tabs/test');
  }

  // Navigate to control page
  control() {
    this.router.navigateByUrl('tabs/bot');
  }
}
