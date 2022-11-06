import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IpServiceService } from 'src/app/services/ip-service/ip-service.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-userentry',
  templateUrl: './userentry.component.html',
  styleUrls: ['./userentry.component.scss']
})
export class UserentryComponent implements OnInit {

  DOM_inputArea: any;
  DOM_cursor: any;
  inputValue: string;           // What's currently held in the input element
  commandHistory: any[];     // History of all commands submitted in session
  historyPointer: number;           // Pointer for which command in the history we're at
  tempStorage: string;          // Temporary storage for a command

  readonly STYLE_cursorInitialPos: any;               // Initial position of the cursor. Subject to change on mobile view.
  readonly STYLE_inputAreaInitialWidth: any; // Initial position of the input area. Don't let it go below 8px

  public user: string;                       // Denotes the prompt for user, contains IP address and who the user is.

  @Output() command = new EventEmitter<string>();  // Returns output string if enter key is pressed

  constructor(private ipservice: IpServiceService, private ref: ChangeDetectorRef) { 
    this.user = '';
    this.inputValue = '';
    this.tempStorage = '';
    this.commandHistory = [];
    this.historyPointer = -1;
    this.STYLE_cursorInitialPos = 0;
    this.STYLE_inputAreaInitialWidth = 0;
  }

  async ngOnInit(): Promise<void> {
    await this.getTerminalUser();
    // Set the cursor here after the prompt has been built
    //this.setCursorInitialPosition();
    
  }

  /*
  * Returns the user of the terminal. Currently only creates prompt strings for visitors.
  */
  async getTerminalUser() {
    this.ipservice.getIPAddress();
    try {
      this.ipservice.getIPAddress().subscribe((res:any) => {
        this.user = res.ip + '@visitor:->';
      });
    } catch {
      // Couldn't connect with API, default to something else
    }

    if (this.user == '') {
      this.user = '127.0.0.1' + '@visitor:->';
    }

  }

  /* 
  * Handles altering DOM elements to changing input. Filters invalid keyCodes.
  */
  filterTextInput(keyPress: any): void {
    const specialKeyCodes = [17, 91, 18, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 145, 19, 93, 16, 20, 9, 27, 45, 36, 46, 33, 34, 35, 144, 111, 106, 109, 36, 38, 33, 107, 37, 12, 39, 35, 40, 34, 13, 45, 46, 145];

    // Export input on Enter keyPress and clear the value being held
    if (keyPress.keyCode == 13) {
      this.commandHistory.push(this.inputValue);  // Add the input metadata to the history
      let outboundString = this.exportLine();     // Build the export string
      this.inputValue = '';                       // Reset the input area
      this.historyPointer = -1;
      this.resetInputField();
      this.command.emit(outboundString);
      this.keepUserEntryInView();                 // Keep the entry area in view

    // Using the up and down arrow keys should scroll the user through the command history.
    } else if (keyPress.keyCode == 38 || keyPress.keyCode == 40) {
      this.scrollCommandHistory(keyPress);
      keyPress.preventDefault();
    // Prevent user from using left/right arrow keys. This functionality may change at a later date.
    } else if (keyPress.keyCode == 37 || keyPress.keyCode == 39) {
      keyPress.preventDefault();

    // Handle characters being entered into the field
    } else if (!(specialKeyCodes.includes(keyPress.keyCode)) && (keyPress instanceof KeyboardEvent) && !(keyPress.ctrlKey)) {
      this.moveInputToTextWidth(keyPress.keyCode);
    
    // Allow onPaste events to occur
    } else if (keyPress.keyCode == 86 && keyPress.ctrlKey) {
      return;
    } else {
      keyPress.preventDefault();
    }
  }

  /*
  * Forces user to only have focus on the input area. Unfocusing should result in this function being immediately called.
  */
  forceFocus(): void {
    document.getElementById('DOM_inputArea')?.focus();
  }

  /*
  * Attaches user prompt to command entered and sends it to the logHistory component to be displayed.
  */
  exportLine(): string {
    let input: string = (<HTMLInputElement>document.getElementById('DOM_inputArea'))?.value;
    let outboundString: string = this.user + ' ' + input;
    return outboundString;
  }

  // Updates the size of the input field to added characters
  private moveInputToTextWidth(keyCode: any): void {
    let inputLength;
    if (this.inputValue?.length === undefined) {
      inputLength = 0;
    } else {
      inputLength = this.inputValue.length;
    }
    const charWidth = 8;
    let inputWidth: number = 0;
    if (keyCode != 8)
      inputWidth = charWidth + (inputLength * charWidth);
    else if (keyCode == 8 && this.inputValue.length-1 > 0)
      inputWidth = (inputLength * charWidth) - 8;
    const STYLE_inputWidth = 'width:'+inputWidth+'px;';
    document.getElementById('DOM_inputArea')?.setAttribute('style', STYLE_inputWidth);
  }

  // Keeps the input width updated to paste events
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (<any>window).clipboardData;
    const pastedText = clipboardData.getData('text');
    const charWidth = 8;
    const currentWidth = document.getElementById('DOM_inputArea')?.getBoundingClientRect().width!;
    const inputWidth = (charWidth * pastedText.length) + currentWidth;
    document.getElementById('DOM_inputArea')?.setAttribute('style', 'width:'+inputWidth+'px;');
  }

  // Prevents user entry field from being obfuscated on overflow-y
  private keepUserEntryInView() {
    document.getElementById('DOM_mainContainer')?.scrollIntoView();
  }

  private resetInputField() {
    document.getElementById('DOM_inputArea')?.setAttribute('style', 'width:0px;');
    document.getElementById('DOM_cursor')?.setAttribute('style', 'left:'+this.STYLE_cursorInitialPos+'px;');
  }

  // TODO: Doesn't work with in-line style. Find work-around.
  private hideCursor() {
    document.getElementById('DOM_cursor')?.setAttribute('style', 'right:'+100+'vw;');
  }

  /*
  * TO DO: Figure out what's wrong with this
  */
  private scrollCommandHistory(keyPress: any): void {

    if (this.commandHistory.length === undefined) {
      return;
    }

    let reformattedHistory = this.commandHistory.slice().reverse();      // The array is reversed to give it a proper stack placement
    
    // historyPointer must be clamped on the array size of commandHistory
    // Scroll to older commands on key up
    if (keyPress.keyCode == 38) {

      if (reformattedHistory.length-1 >= this.historyPointer) {
        if (this.historyPointer == -1) {
          this.historyPointer += 1;
          this.inputValue = reformattedHistory[this.historyPointer];
        } else if (this.historyPointer != reformattedHistory.length) {
          if (this.historyPointer != reformattedHistory.length-1) {
            this.historyPointer += 1;
            this.inputValue = reformattedHistory[this.historyPointer];
          }
          this.hideCursor();
        }
        this.moveInputToTextWidth(null);
        return;
      } else {
        return;
      }
    // Scroll to newer commands on key down
    } else if (keyPress.keyCode == 40) {

      if (this.historyPointer != -1) {
        this.historyPointer -= 1;
        this.hideCursor();
      } else {
        this.historyPointer = -1
        this.inputValue = '';
        this.resetInputField();
        return;
      }
      this.inputValue = reformattedHistory[this.historyPointer];
      this.moveInputToTextWidth(null);
      return;
    }
  }
  

}
