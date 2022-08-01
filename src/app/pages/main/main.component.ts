import { Component, OnInit } from '@angular/core';
import { SHA256, enc } from 'crypto-js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  command: string;         // Command received from UserEntry component
  command_SIGNED: string;  // Signed command to be sent to other components

  constructor() {
    this.command = '';
    this.command_SIGNED = '';
  }

  ngOnInit(): void {
  }

  processCommand(iCommand: string) {
    this.command = iCommand;
    this.signCommand(iCommand);
    this.command_SIGNED = JSON.stringify(this.signCommand(iCommand));
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
  

}
