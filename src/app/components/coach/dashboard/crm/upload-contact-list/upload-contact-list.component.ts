import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-contact-list',
  templateUrl: './upload-contact-list.component.html',
  styleUrls: ['./upload-contact-list.component.css']
})
export class UploadContactListComponent implements OnInit {
  uploadFileStatus = 'Upload';
  background = 'white';
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

  ngOnInit() {
  }
  handleFileInput(evet){
    console.log(evet);
    this.uploadFileStatus = 'Uploading';
    setTimeout(()=>{
      this.uploadFileStatus = 'error';
    },2000)
  }

  dropped(evet){
    console.log(evet);
  }
  fileOver(event){
    console.log(event);
  }
  fileLeave(event){
    console.log(event);
  }
  tryAgain(){
      this.uploadFileStatus = 'Uploaded';
      this.background = '#F7F7F7';
  }
  nextPage(section){
    this.uploadFileStatus = section;
  }
}
