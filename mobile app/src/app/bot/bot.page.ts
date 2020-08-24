import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import { ToastController } from '@ionic/angular';

import * as nipplejs from 'nipplejs';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.page.html',
  styleUrls: ['./bot.page.scss'],
})

export class BotPage {
  state:boolean = true;
  hasGP:any = false;
  repGP:any;
  gp:any;
  x:any;
  controller:boolean = false;
  manager:any;
  interval:any;
  skip:boolean = false;
  urls:any = [];
  refresh:number = 200;
  nrefresh:number;
  oldl:any = [0,0];
  oldr:any = [0,0];
  currentl:any;
  currentr:any;

  constructor(private socket: Socket, private insomnia: Insomnia, public toastController: ToastController) {
 }

 async presentToast(message:string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 2000,
       mode: "ios",
       color: "light",
       showCloseButton: true
     });
     toast.present();
   }

 clipboard(code:any) {
   const el = document.createElement('textarea');
   el.value = code;
   document.body.appendChild(el);
   el.select();
   document.execCommand('copy');
   document.body.removeChild(el);

   this.presentToast("Copied to clipboard.");
 }

 refreshupdate() {
   if (this.nrefresh) {
     this.refresh = this.nrefresh;

     if (this.x) {
       clearInterval(this.x);
       this.x = setInterval(() => { this.reportOnGamepad(); }, this.refresh);
     }
   }
 }

  ngOnInit() {
    var that = this;
    this.socket.on('connectb', function(data) {
      var then = that;
      console.log('connect');
      that.state = false;

      that.manager.on('move', function (evt, data) {
        console.log(data.angle.degree, data.force);

        if (then.skip === false) {
          then.socket.emit('js', [data.angle.degree, data.force]);
          then.skip = true;
        } else {
          then.skip = false;
        }

      });
    });

    this.socket.on('zbar', function(data) {
      that.urls = data;
    });

    let options = {
    zone: document.getElementById('zone_joystick'),
    color: 'white',
    size: 160
    };
    this.manager = nipplejs.create(options);

  }

  ionViewWillEnter() {

    this.insomnia.keepAwake().then(
      () => console.log('insomnia keepAwake success'),
      () => this.presentToast("Insomnia Active Error.")
    );

    var that = this;

    this.socket.connect();

    this.socket.emit('connectr', 'connect');

    this.interval = setInterval(function(){
     if(that.canGame() !== null) {
       if (that.controller === false) {
           that.controller = true;
           that.x = setInterval(() => { that.reportOnGamepad(); }, that.refresh);
         console.log("creating interval");

         that.presentToast("Controller Connected.");
       }
     } else {
       if (that.controller === true) {
         that.controller = false;
         clearInterval(that.x);
         console.log("clearing interval");
         that.presentToast("Controller Disconnected.");
       }
     }
   },1000);

    //if(this.canGame() === null) {
    //  this.controller = true;
    //  this.x = setInterval(() => { this.reportOnGamepad(); }, 10);
    //} else {
    //  console.log("no game")
    //}

  }

  ionViewWillLeave() {
    this.socket.disconnect();

    this.state = true;

    this.controller = false;
    clearInterval(this.x);
    clearInterval(this.interval);

    this.manager.off();

    this.insomnia.allowSleepAgain().then(
      () => console.log('insomnia allowSleepAgain success'),
      () => this.presentToast("Insomnia Deactivate Error.")
    );

    this.urls = [];
  }

  canGame() {
    return navigator.getGamepads()[0];
  }



  reportOnGamepad() {

    this.gp = navigator.getGamepads()[0];

    let circle = document.getElementsByClassName("circle") as HTMLCollectionOf<HTMLElement>;
    let circle2 = document.getElementsByClassName("circle2") as HTMLCollectionOf<HTMLElement>;
    let up = document.getElementById("up") as HTMLElement;
    let down = document.getElementById("down") as HTMLElement;
    let left = document.getElementById("left") as HTMLElement;
    let right = document.getElementById("right") as HTMLElement;
    let triangle = document.getElementById("triangle") as HTMLElement;
    let circleb = document.getElementById("circle") as HTMLElement;
    let cross = document.getElementById("cross") as HTMLElement;
    let square = document.getElementById("square") as HTMLElement;
    let share = document.getElementById("share") as HTMLElement;
    let options = document.getElementById("options") as HTMLElement;
    let triggerlarge = document.getElementById("triggerlarge") as HTMLElement;
    let triggersmall = document.getElementById("triggersmall") as HTMLElement;
    let triggersmallright = document.getElementById("triggersmallright") as HTMLElement;
    let triggerlargeright = document.getElementById("triggerlargeright") as HTMLElement;

    if (this.gp || this.state) {
    for(var i=0;i<this.gp.axes.length; i+=2) {
        if (i === 0) {
          this.currentl = [this.gp.axes[i], this.gp.axes[i+1]];

          if (this.currentl[0] !== this.oldl[0] || this.currentl[1] !== this.oldl[1]) {
            this.oldl = [this.gp.axes[i], this.gp.axes[i+1]];
            this.socket.emit('commandl', [this.gp.axes[i], this.gp.axes[i+1]]);
          }

          //console.log("1", (this.gp.axes[i+1]*100).toString())
          circle[0].style.left = (130+(15*this.gp.axes[i])).toString() + "px";
          circle[0].style.top = (110+(15*this.gp.axes[i+1])).toString() + "px";
        } else {
          this.currentr = [this.gp.axes[i], this.gp.axes[i+1]];

          if (this.currentr[0] !== this.oldr[0] || this.currentr[1] !== this.oldr[1]) {
            this.oldr = [this.gp.axes[i], this.gp.axes[i+1]];
            this.socket.emit('commandr', [this.gp.axes[i], this.gp.axes[i+1]]);
          }

          circle2[0].style.left = (290+(15*this.gp.axes[i])).toString() + "px";
          circle2[0].style.top = (110+(15*this.gp.axes[i+1])).toString() + "px";
        }
      }

    for(var i=0;i<this.gp.buttons.length;i++) {
        if ((i+1) === 13) {
          if(this.gp.buttons[i].pressed) {
            up.style.backgroundColor = "#2b2b2b";
          } else {
            up.style.backgroundColor = "#ffffff";
          }
        }

        if ((i+1) === 14) {
            if(this.gp.buttons[i].pressed) {
              down.style.backgroundColor = "#2b2b2b";
            } else {
              down.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 15) {
            if(this.gp.buttons[i].pressed) {
              left.style.backgroundColor = "#2b2b2b";
            } else {
              left.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 16) {
            if(this.gp.buttons[i].pressed) {
              right.style.backgroundColor = "#2b2b2b";
            } else {
              right.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 4) {
            if(this.gp.buttons[i].pressed) {
              triangle.style.backgroundColor = "#2b2b2b";
            } else {
              triangle.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 2) {
            if(this.gp.buttons[i].pressed) {
              circleb.style.backgroundColor = "#2b2b2b";
            } else {
              circleb.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 1) {
            if(this.gp.buttons[i].pressed) {
              cross.style.backgroundColor = "#2b2b2b";
            } else {
              cross.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 3) {
            if(this.gp.buttons[i].pressed) {
              square.style.backgroundColor = "#2b2b2b";
            } else {
              square.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 9) {
            if(this.gp.buttons[i].pressed) {
              share.style.backgroundColor = "#2b2b2b";
            } else {
              share.style.backgroundColor = "#ffffff";
            }
          }

        if ((i+1) === 10) {
           if(this.gp.buttons[i].pressed) {
             options.style.backgroundColor = "#2b2b2b";
           } else {
             options.style.backgroundColor = "#ffffff";
           }
         }

       if ((i+1) === 7) {
            if(this.gp.buttons[i].pressed) {
              triggerlarge.style.backgroundColor = "#2b2b2b";
            } else {
              triggerlarge.style.backgroundColor = "#ffffff";
            }
          }

      if ((i+1) === 5) {
          if(this.gp.buttons[i].pressed) {
            triggersmall.style.backgroundColor = "#2b2b2b";
          } else {
            triggersmall.style.backgroundColor = "#ffffff";
          }
        }

      if ((i+1) ===6) {
          if(this.gp.buttons[i].pressed) {
            triggersmallright.style.backgroundColor = "#2b2b2b";
          } else {
            triggersmallright.style.backgroundColor = "#ffffff";
          }
        }

      if ((i+1) ===8) {
          if(this.gp.buttons[i].pressed) {
            triggerlargeright.style.backgroundColor = "#2b2b2b";
          } else {
            triggerlargeright.style.backgroundColor = "#ffffff";
          }
        }
      }
    }
  }
}
