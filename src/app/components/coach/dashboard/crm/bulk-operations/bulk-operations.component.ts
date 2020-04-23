import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bulk-operations',
  templateUrl: './bulk-operations.component.html',
  styleUrls: ['./bulk-operations.component.css']
})
export class BulkOperationsComponent implements OnInit {
  operations:any =[
    {
      name:"Add people operation",
      contact:"10 contact",
      action:"2 actions",
      createdAt:"10/15/1992"
    },
    {
      name:"Add people operation",
      contact:"10 contact",
      action:"2 actions",
      createdAt:"10/15/1992"
    },
    {
      name:"Add people operation",
      contact:"10 contact",
      action:"2 actions",
      createdAt:"10/15/1992"
    },
    {
      name:"Add people operation",
      contact:"10 contact",
      action:"2 actions",
      createdAt:"10/15/1992"
    }
  ]
  constructor(public router: Router) { }

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
  addNewBulkOperation(){
    this.router.navigate(['/addNewBulkOperation']);
  }
}
