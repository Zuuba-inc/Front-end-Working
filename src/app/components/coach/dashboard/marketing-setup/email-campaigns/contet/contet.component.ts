import { Component, OnInit,HostListener  } from '@angular/core';
// import jquery
import * as $ from 'jquery';
@Component({
  selector: 'app-contet',
  templateUrl: './contet.component.html',
  styleUrls: ['./contet.component.css']
})
export class ContetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public handleScroll(event) {
    var x = event.originalEvent.target.scrollTop;
    var y = -x;
    $('#main .theme2').css('background-position','0% '+y+'px');
  }
}
