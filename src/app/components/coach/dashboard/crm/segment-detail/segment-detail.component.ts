import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-segment-detail',
  templateUrl: './segment-detail.component.html',
  styleUrls: ['./segment-detail.component.css']
})
export class SegmentDetailComponent implements OnInit {
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
  segmentDetailStatus = "exportCsvFile"
  mergeContactStep = 'Step2';
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
  openExportCSV(){
    console.log("OpenExportCSV");
    console.log(document.getElementById("exportCSV").style.display);
    if(document.getElementById("exportCSV").style.display == 'none'){
      document.getElementById("exportCSV").style.display = 'block'
    }else{
      document.getElementById("exportCSV").style.display = 'none'
    }
    //$("#").modal("show");
  }
  changeStatus(status){
    if(status == 'exportCsvFile'){
      this.openExportCSV();
    }
    this.segmentDetailStatus = status;
  }
  changeMergeContactStep(step){
    this.mergeContactStep = step;
  }
  openCity(evt, cityName){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    console.log(evt);
     evt.target.className += " active";
  }
}
