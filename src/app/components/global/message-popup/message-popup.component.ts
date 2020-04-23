import { Component, OnInit,Input, Output, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {
  @Input() popUpMessage: any;

  constructor() {
    
   }
   message;
   responseMessage:any={};
  ngOnInit() {
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    //alert("Inside Message popup")
    let log: string[] = [];

    let changedProp: any;

    for (let propName in changes) {

      changedProp = changes[propName];
     
      console.log("changedProp", changedProp.currentValue);
      this.responseMessage =  changedProp.currentValue;
      if(this.responseMessage.type == 'ERROR'){
                      // Get the snackbar DIV
            var errorBox = document.getElementById("errorMessage");
            var messsgaeBox = document.getElementById("messageAlert");
            messsgaeBox.style.backgroundColor = 'red';
            // Add the "show" class to DIV
            messsgaeBox.className = messsgaeBox.className+ ' show';
            errorBox.className =errorBox.className+ " show";
            // After 3 seconds, remove the show class from DIV
           setTimeout(()=>{ 
            messsgaeBox.className = messsgaeBox.className.replace("show", "");
             }, 3000);
            // this.message = response.message;
      }else{
        var errorBox = document.getElementById("errorMessage");
        var messsgaeBox = document.getElementById("messageAlert");
        // Add the "show" class to DIV
        messsgaeBox.style.backgroundColor = 'green';
        messsgaeBox.className = messsgaeBox.className+ ' show';
        errorBox.className ='snackbar';
        setTimeout(()=>{ 
          messsgaeBox.className = messsgaeBox.className.replace("show", "");
           }, 3000);
      }
    }
  }
}
