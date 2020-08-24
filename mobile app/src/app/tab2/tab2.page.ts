import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  type:string = 'Loading';
  loading:any = false;
  time:any = false;

  constructor(private router:Router, private socket: Socket) {}

  ngOnInit() {
    var that = this;
    this.socket.on('response', function(data) {

      console.log('recieve: ' + data);
      that.type = "Loaded Application Type: " + data;
      that.loading = true;

      console.log("routing")
      that.router.navigateByUrl('tabs/' + data)

    });
  }

  ionViewWillEnter() {
      var that = this;
      console.log("initialising")
      this.socket.connect();

      this.socket.emit('version', 'version request');

  }

  ionViewWillLeave() {
    this.loading = false;
    this.time = false;
    this.type = 'Loading';

    this.socket.disconnect();
  }


/*
  go() {
    console.log("routing")
    this.router.navigateByUrl('tabs/test')
  }
*/
}
