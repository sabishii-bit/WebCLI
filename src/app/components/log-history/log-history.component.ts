import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.scss']
})
export class LogHistoryComponent implements OnChanges {

  @Input() incomingCommand: string;
  
  history: any[];
  JSON_incomingCommand: any;
  displayGreetings: boolean;

  constructor() {
    this.history = [];
    this.incomingCommand = '';
    this.displayGreetings = true;
  }

  ngOnChanges(): void {
    // Incoming commands will all have a signature tied to them and are converted JSON objects
    // Use JSON.parse to convert it from its string format back to an object
    if (this.incomingCommand != '') {
      this.JSON_incomingCommand = JSON.parse(this.incomingCommand);

      this.parseCommands(this.JSON_incomingCommand.value)
      if (this.JSON_incomingCommand != null) {
        this.updateView();
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
    }

  }

  private updateView() {
    this.history.push(this.JSON_incomingCommand.value);
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
  }

}
