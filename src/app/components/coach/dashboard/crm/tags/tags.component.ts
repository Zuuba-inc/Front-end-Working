import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  tags : any =[
    {
      name: 'Coaching List'
    },
    {
      name: 'Complete Program'
    },
    {
      name: 'Quiz'
    }
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
