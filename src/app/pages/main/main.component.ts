import { Component, OnInit, OnChanges } from '@angular/core';
import { SHA256, enc } from 'crypto-js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  command: string;         // Command received from UserEntry component
  command_SIGNED: string;  // Signed command to be sent to other components
  tokens: any;              // Token received from component to be processed
  STYLE_borderColor: any;   // Border color for the console window
  STYLE_rgb: any;           // Helper object with border color

  constructor() {
    this.command = '';
    this.command_SIGNED = '';
    this.tokens = null;    
    this.STYLE_rgb = {
      r: 0,
      g: 0,
      b: 255
    }
    this.STYLE_borderColor = "rgb("+ this.STYLE_rgb.r + ',' + this.STYLE_rgb.g + ',' + this.STYLE_rgb.b + ")";
  }

  async ngOnInit() {
    // Set the background to whatever the user has set in local storage
    if (!!localStorage.getItem('background')) {
      document.getElementById('root')?.setAttribute('style', 'background-image: url("'+localStorage.getItem('background')+'");');
    }

    // Begin animating the console border
    this.alternateBorderColor()
  }

  // This is an outgoing command that needs to be processed first
  processCommand(iCommand: string) {
    this.command = iCommand;
    this.signCommand(iCommand);
    this.command_SIGNED = JSON.stringify(this.signCommand(iCommand));
  }

  // This is an incoming command that has been tokenized and needs to processed
  processToken(iToken: any) {
    this.tokens = iToken;
    if (this.tokens[0].toUpperCase() == 'SET-BACKGROUND') {
      this.command_BACKGROUND(this.tokens[1]);
    }
  }

  /*
  * Generates unique hash signatures to be paired with commands
  */
  private signCommand(iCommand: string): any {
    const uniqueNum: string = Math.random().toString();
    const hash: string = SHA256(uniqueNum).toString(enc.Hex);
    let command_SIGNED = {value: '', signature: ''};

    command_SIGNED.value = iCommand;
    command_SIGNED.signature = hash;
    
    return command_SIGNED;
  }

  private command_BACKGROUND(URL_token: string) {
    if (URL_token.toUpperCase() == '-RESET') {
      localStorage.removeItem('background');
      document.getElementById('root')?.setAttribute('style', 'background-image: url("../../../assets/images/Matrix-Rain.gif")');
      return;
    } else {
      localStorage.setItem('background', URL_token);
      document.getElementById('root')?.setAttribute('style', 'background-image: url("'+URL_token+'");');
      return;
    }
  }
  
  // Animates the color rotation on the border for the console window
  private alternateBorderColor() {
    setInterval(() => {
      if (this.STYLE_rgb.b != 0 && this.STYLE_rgb.g != 255 && this.STYLE_rgb.r == 0) {
        this.STYLE_rgb.b -= 1;
        this.STYLE_rgb.g += 1;
        this.STYLE_borderColor = "rgb("+ this.STYLE_rgb.r + ',' + this.STYLE_rgb.g + ',' + this.STYLE_rgb.b + ")";
      }
      if (this.STYLE_rgb.g != 0 && this.STYLE_rgb.r != 255 && this.STYLE_rgb.b == 0) {
        this.STYLE_rgb.g -= 1;
        this.STYLE_rgb.r += 1;
        this.STYLE_borderColor = "rgb("+ this.STYLE_rgb.r + ',' + this.STYLE_rgb.g + ',' + this.STYLE_rgb.b + ")";
      }
      if (this.STYLE_rgb.r != 0 && this.STYLE_rgb.b != 255 && this.STYLE_rgb.g == 0) {
        this.STYLE_rgb.r -= 1;
        this.STYLE_rgb.b += 1;
        this.STYLE_borderColor = "rgb("+ this.STYLE_rgb.r + ',' + this.STYLE_rgb.g + ',' + this.STYLE_rgb.b + ")";
      }
    }, 1)
  }

}
