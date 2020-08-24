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

  // Creates response handler which will automatically navigate to the control page on successful BattleBot identification
  ngOnInit() {
    var outerScope = this;
    this.socket.on('response', function(data) {

      console.log('recieve: ' + data);
      outerScope.type = "Loaded Application Type: " + data;
      outerScope.loading = true;

      console.log("routing")
      outerScope.router.navigateByUrl('tabs/' + data)

    });
  }

  // Attempts connection to server
  ionViewWillEnter() {
      console.log("initialising")
      this.socket.connect();

      this.socket.emit('version', 'version request');

  }

  // Variable cleanup on route change
  ionViewWillLeave() {
    this.loading = false;
    this.time = false;
    this.type = 'Loading';

    this.socket.disconnect();
  }
}
