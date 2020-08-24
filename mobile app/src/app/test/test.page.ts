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
    var outerScope = this;

    // Adds any incoming messages to list. List is then displayed on html.
    this.socket.on('echob', function(data) {
      console.log('recieve: ' + data);
      outerScope.items.push(data);
    });

    // Checks if server successfully connected. When state is false, the loading bar does not show
    this.socket.on('connectb', function(data) {
      console.log('connect');
      outerScope.state = false;
    });
  }

  // Initiates connection
  ionViewWillEnter() {
    var outerScope = this;
    this.socket.connect();
    this.socket.emit('connectr', 'connect');
  }

  // Variable cleanup
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
