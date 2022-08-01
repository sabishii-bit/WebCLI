import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.scss']
})
export class LogHistoryComponent implements OnChanges {

  @Input() incomingCommand: string;
  @Output() outgoingToken = new EventEmitter<string>();
  
  history: any[];
  JSON_incomingCommand: any;
  displayGreetings: boolean;

  constructor(private deviceDetector: DeviceDetectorService) {
    this.history = [];
    this.incomingCommand = '';
    this.displayGreetings = true;
  }

  ngOnChanges(): void {
    // Incoming commands will all have a signature tied to them and are converted JSON objects
    // Use JSON.parse to convert it from its string format back to an object
    if (this.incomingCommand != '') {
      this.JSON_incomingCommand = JSON.parse(this.incomingCommand);

      if (this.JSON_incomingCommand != null) {
        this.addCommandToHistory(this.JSON_incomingCommand.value);
        this.parseCommands(this.JSON_incomingCommand.value);
      }
    }
  }

  /*
  * All commands that affect the history or code placed into the log are processed in this function
  */
  private parseCommands(command: any) {

    // Tokenize the incoming command by spaces. [0] will always be the user prompt.
    command = command.split(' ');

    // Flushes out the history
    if (command[1].toUpperCase() == 'CLEAR') {
      this.command_CLEAR();
      return;

    } else if (command[1].toUpperCase() == 'GREETME') {
      this.command_GREETINGS();
      return;

    } else if (command[1].toUpperCase() == 'SET-BACKGROUND') {
      if (command[2]) {
        this.command_BACKGROUND(command);
      } else {
        this.history.push('ERROR: set-background command requires an image URL for the background to be set to.');
        this.history.push('Example: \'set-background https://website.com/image.png\'');
      }

    } else if (command[1].toUpperCase() == 'WHOAMI') {
      this.command_WHOAMI();
    }

  }

  private addCommandToHistory(command: any) {
    this.history.push(command);
  }

  /*
  * All the different commands involving the log will go here
  */
  private command_CLEAR() {
    this.history = [];
    this.JSON_incomingCommand = null;
    this.displayGreetings = false;
    return;
  }

  private command_GREETINGS() {
    this.displayGreetings = true;
    return;
  }

  private command_BACKGROUND(command: any) {
    this.outgoingToken.emit(command);
    return;
  }

  private command_WHOAMI() {
    const userInfo = this.deviceDetector.getDeviceInfo();
    this.history.push('*-- This is the information I could retrieve about you --*');
    this.history.push('Browser: '+userInfo.browser);
    this.history.push('Version: '+userInfo.browser_version);
    this.history.push('Device: '+userInfo.deviceType);
    this.history.push('Orientation: '+userInfo.orientation);
    this.history.push('Operating System: '+userInfo.os_version);
    this.history.push('UserAgent: '+userInfo.userAgent);
    return;
  }

}
