import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {
  primaryFields:any = [
    {name: 'Phone'},
    {name: 'State'},
    {name: 'Zip'},
  ];
  customFields:any = [
    {name: 'Company'},
    {name: 'Position'},
    {name: 'Address'},
  ];
  constructor() { }

  ngOnInit() {
  }
  openViewDropDown(id){
    var dropDown = document.getElementById(id);
      if(dropDown.style.display == 'none'){
        dropDown.style.display = 'block';
      }else{
        dropDown.style.display = 'none';
      }
  }
  closeEditEmailDropDown(id){
    document.getElementById(id).style.display = 'none';
  }
}
