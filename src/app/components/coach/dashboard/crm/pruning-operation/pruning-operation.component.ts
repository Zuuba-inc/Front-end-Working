import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pruning-operation',
  templateUrl: './pruning-operation.component.html',
  styleUrls: ['./pruning-operation.component.css']
})
export class PruningOperationComponent implements OnInit {
  operations:any =[
    {
      operation:"0 person Purining Operation",
      createdAt:"10/15/1992"
    },
    {
      operation:"4 person Purining Operation",
      createdAt:"10/15/1992"
    },
    {
      operation:"0 person Purining Operation",
      createdAt:"10/15/1992"
    },
    {
      operation:"0 person Purining Operation",
      createdAt:"10/15/1992"
    }
  ]
  constructor(public router : Router) { }

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
  addNewPruningOperation(){
    this.router.navigate(['/addPruningOperation']);
  }
}
