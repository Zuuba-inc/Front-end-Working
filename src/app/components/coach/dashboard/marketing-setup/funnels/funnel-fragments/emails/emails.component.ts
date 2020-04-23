import { Component, OnInit ,Input} from '@angular/core';
import { FragmentComponent }      from 'src/app/services/global/interfaces/fragment-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css']
})
export class EmailsComponent implements OnInit ,FragmentComponent{
  @Input() data: any;
  clazz : any;
  constructor(
    private router: Router
  ) { }

  showOptions: boolean = false;

  ngOnInit() {
  }

  // used to toggle fragment options
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  onEmailsEditClick() {
    console.log("data", this.data);
    let id;
    if (this.data && this.data.stepDetailTitle.toLowerCase().includes("webinar")) {
      id = localStorage.getItem("webinarEcId");
      localStorage.setItem("emailCampaignId", id);
    }  else {
      id = localStorage.getItem("quizEcId");
      localStorage.setItem("emailCampaignId", id);
    }
    this.router.navigate(['/emailList/']);
  }

}
