import { Component, OnInit } from '@angular/core';
import { FunnelService } from '../../../../../../services/coach/funnel/funnel.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FunnelFragmentsService } from 'src/app/services/coach/funnel/funnel-fragments.service';
@Component({
  selector: 'app-funnel-types',
  templateUrl: './funnel-types.component.html',
  styleUrls: ['./funnel-types.component.css']
})
export class FunnelTypesComponent implements OnInit {

  // list of funnels 
  funnelsList: any = []
  data:any={};
  showCreateFunnel = false;
  funnel:any={
    funnelType:{}
  };
  selectedFunnel:any={};
  constructor(public funnelService: FunnelService,
              public router: Router,
              public funnelFragmentService :FunnelFragmentsService) { }

  ngOnInit() {
    localStorage.removeItem("editFunnel");
    localStorage.removeItem("editWebinar");
    localStorage.removeItem("editQuiz");
    localStorage.removeItem("funnelUrl");
    localStorage.removeItem("funnel");
    this.getFunnelList();
  }

  // takes array of strings and appends them as url
  getAppendedUrl(splitName, appendText?) {

    let name = "";

    for (let i=0; i<splitName.length; i++) {
      if (appendText) {
        if (i == 0)
        name = name + splitName[i];
        else 
          name = name + appendText + splitName[i];
      }
      else 
      name = name + splitName[i];
    }

    return name;

  } 

  // Get all the type of funnels
  getFunnelList(){
    this.funnelService.getFunnelTypeList().subscribe(funnel=>{
        this.data = funnel;
       // console.log(this.data)
        if(this.data.status == 'SUCCESS'){
          this.funnelsList = this.data.data;

          let self = this;

          // update url based on funnelName for route links
          this.funnelsList.map(function(item) {

            let fName = item.funnelName;

            // if funnelName has space and '+', split based on it and append with 'and'
            if (fName.includes(" + ")) {

              let splitName = item.funnelName.split(" + ");

              // update funnelUrl with appended 'and'
              item.funnelUrl = self.getAppendedUrl(splitName, "and");
            } else if (fName.includes(" ")) {

              let splitName = item.funnelName.split(" ");

              // update funnelUrl with appended 'and'
              item.funnelUrl = self.getAppendedUrl(splitName);
            } else {

              // no spaces and '+', funnelName is the Url
              item.funnelUrl = item.funnelName;
            }

            return item;
          })

          console.log("updated funnelList with url", this.funnelsList);
        }else{
          this.serverError(this.data);
        }
    })
  }

  createFunnel(funnel){
      this.showCreateFunnel = true;
      this.funnel.funnelType.id=  funnel.id
      this.selectedFunnel = funnel;
      console.log(this.selectedFunnel)
  }

  // Save funnel 
  async saveFunnel(){
    console.log(this.funnel)
    if(this.funnel.funnelName ||this.funnel.funnelName != null){
    let funnel :any = await this.funnelService.saveFunnel(this.funnel);
    console.log(funnel)
    if(funnel.status == 'SUCCESS'){
       localStorage.setItem("funnel", funnel.data.id);
       localStorage.setItem("funnelUrl", this.selectedFunnel.funnelUrl);
       this.funnelFragmentService.saveFunnelData(funnel.data);
       this.router.navigate(['/funnelCreate/'+this.selectedFunnel.funnelUrl]);
    }else{
      this.serverError(funnel);
    }
  }else{
    Swal.fire({
      text: "Please enter the funnel name",
      type: 'warning',
    })
  }
  }
  //Handeler that handels erorr if the status code of the api is not SUCCESS
  serverError(data){
      Swal.fire({
        text: data.message,
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
  }
}
