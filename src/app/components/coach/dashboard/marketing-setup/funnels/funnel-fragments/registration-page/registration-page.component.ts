import { Component, OnInit, Input } from '@angular/core';

import { FragmentComponent }      from 'src/app/services/global/interfaces/fragment-component';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit, FragmentComponent {

  @Input() data: any;
  clazz: any;
  constructor() { }

  showOptions: boolean = false;

  ngOnInit() {
  }

  // used to toggle fragment options
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

}
