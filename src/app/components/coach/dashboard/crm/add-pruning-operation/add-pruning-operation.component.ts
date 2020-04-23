import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-pruning-operation',
  templateUrl: './add-pruning-operation.component.html',
  styleUrls: ['./add-pruning-operation.component.css']
})
export class AddPruningOperationComponent implements OnInit {
  segmentContacts: any =[ 
    {
      name: 'Martin Richard',
      email:'martinrichard@gmail.com',
      phnNumber:'+6548638749',
      location: 'Mumbai',
      date: '10/15/1992'
    },
    {
      name: 'Ryan Evans',
      email:'kathy.brewer@mail.com',
      phnNumber:'(254)625-2969',
      location: 'Brussels',
      date: '2/15/1992'
    },
    {
      name: 'Kathy Willis',
      email:'dennis.baker@mail.com',
      phnNumber:'(570)875-9599',
      location: 'Chiang Mai',
      date: '9/15/1992'
    },
    {
      name: 'Louisa Hayes',
      email:'kelly.bradley@mail.com',
      phnNumber:'(567)222-4988',
      location: 'Seattle',
      date: '08/12/1985'
    },
    {
      name: 'Joe Powell',
      email:'beverly.brewer@mail.com',
      phnNumber:'(190)307-8321',
      location: 'Valparaiso',
      date: '10/15/1992'
    },
    {
      name: 'Martin Richard',
      email:'martinrichard@gmail.com',
      phnNumber:'+6548638749',
      location: 'Mumbai',
      date: '10/15/1992'
    }
  ]
  constructor() { }
  showFilter = false;
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
  changeShowFilter(){
    if(this.showFilter == true){
      this.showFilter = false;
    }else{
      this.showFilter = true;
    }
  }
}
