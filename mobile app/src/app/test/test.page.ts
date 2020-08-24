import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage {
  echoer:string = "";
  event:any = false;
  items:string[] = [];
  state:boolean = true;

  constructor(private socket: Socket) { }

  ngOnInit() {
    var that = this;
    this.socket.on('echob', function(data) {
      console.log('recieve: ' + data);
      that.items.push(data);
    });

    this.socket.on('connectb', function(data) {
      console.log('connect');
      that.state = false;
    });
  }

  ionViewWillEnter() {
    var that = this;

    this.socket.connect();

    this.socket.emit('connectr', 'connect');
  }

  ionViewWillLeave() {
    this.socket.disconnect();

    this.state = true;
  }

  send() {
    // console.log(this.items)
    // this.items.push(this.echoer);

    if (this.echoer !== ""){
    this.socket.emit('echo', this.echoer);
}
}

  clear() {
    this.items = [];
  }

}
