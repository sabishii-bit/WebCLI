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

  constructor() {
    this.command = '';
    this.command_SIGNED = '';
    this.tokens = null;
  }

  ngOnInit(): void {
    if (!!localStorage.getItem('background')) {
      document.getElementById('root')?.setAttribute('style', 'background-image: url("'+localStorage.getItem('background')+'");');
    }
  }

  processCommand(iCommand: string) {
    this.command = iCommand;
    this.signCommand(iCommand);
    this.command_SIGNED = JSON.stringify(this.signCommand(iCommand));
  }

  processToken(iToken: any) {
    this.tokens = iToken;
    if (this.tokens[1].toUpperCase() == 'SET-BACKGROUND') {
      this.command_BACKGROUND(this.tokens[2]);
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
  

}
