import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any; // ADD THIS

@Component({
  selector: 'app-email-sequence-blueprints',
  templateUrl: './email-sequence-blueprints.component.html',
  styleUrls: ['./email-sequence-blueprints.component.css']
})
export class EmailSequenceBlueprintsComponent implements OnInit {

  constructor() { }
  from_email;
  unsubscribe_link;
  ngOnInit() {
    let dropdown = document.getElementsByClassName("dropdown-btn");
    let i;
            
            for (i = 0; i < dropdown.length; i++) {
              dropdown[i].addEventListener("click", function() {
              this.classList.toggle("active");
              let dropdownContent = this.nextElementSibling;
              if (dropdownContent.style.display === "block") {
              dropdownContent.style.display = "none";
              } else {
              dropdownContent.style.display = "block";
              }
              });
            }
  }

}
