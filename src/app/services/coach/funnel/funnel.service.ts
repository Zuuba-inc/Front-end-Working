import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Common } from '../../global/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient,HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FunnelService {

  constructor(
    // private http: Http,
    private http: HttpClient,
    private authService: AuthapiserviceService,
    private common: Common,
    private router: Router,
  ) { }
  baseURL = this.common.baseurl;
  funnelBaseUrl = this.baseURL+'/funnel';
  // public headers = new Headers({ 'Content-Type': 'application/json' });
  // public options = new RequestOptions({ headers: this.headers });
   public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public options = ({ headers: this.headers });
  authToken;

  //To update the header, add bearer token in the header
  async updateHeader(): Promise<void> {
    //  console.log('inside update header');
    if (this.authService.getToken() == '' || this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    } else {
      // console.log("Inside if:"+this.authService.getToken());
      this.authToken = JSON.parse(this.authService.getToken());
      console.log(this.authToken.access_token);
      this.headers = new HttpHeaders()
      .set('Authorization', 'bearer ' + this.authToken.access_token)
      .set('Content-Type', 'application/json')
      this.options = ({ headers: this.headers });
      // if (this.headers.get('Authorization') == null) {
      //   this.headers.append('Authorization', 'bearer ' + this.authToken.access_token);
      //   // this.headers.append('Authorization', 'bearer ' + "inavlidtokenrandowmylput");
      //   this.options = new RequestOptions({ headers: this.headers });
      //   // return 1;
      // }

    }
  }
  
  // API request to get all the funnel type
   getFunnelTypeList() {
    try {
    return this.http.get(this.funnelBaseUrl+'/listFunnel');
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to get all the Steps for a specific funnel type
  // this returns funnelSteps based on funnelType id
  // for webinar, id is 1
  // for quiz+webinar, id is 2, etc.,
  getFunnelSteps(id) {
    try {
    return this.http.get(this.funnelBaseUrl+'/getFunnelSteps?funnelTypeId='+id).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to get funnels list created
  async getFunnelsList(pageNumber, status?: string ) {
    await this.updateHeader()
    try {
      var url ;
      if(status){
          url = this.funnelBaseUrl+'/getFunnelList?status='+status+"&pageNo="+pageNumber;
      }else{
        url = this.funnelBaseUrl+'/getFunnelList?pageNo='+pageNumber;
      }
      return this.http.get(url, this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  // API request to save funnel
  async saveFunnel(funnel) {
    await this.updateHeader();
    try {
    return this.http.post(this.funnelBaseUrl+'/createEditFunnel', funnel, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to get funnel by id
  async getFunnelById(id, moduleName) {
    await this.updateHeader();
    try {
    return this.http.post(this.funnelBaseUrl+'/getFunnelDetail?id='+id+"&moduleName="+moduleName,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to change the funnel status
  async changeFunnelStatus(status, id) {
    await this.updateHeader();
    try {
    return this.http.post(this.funnelBaseUrl+'/updateFunnelStatus?id='+id+"&status="+status,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to delete funnel
  async deleteFunnel(id) {
    await this.updateHeader();
    try {
    return this.http.post(this.funnelBaseUrl+'/deleteFunnel?id='+id,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  // API request to create a duplicate of a existing funnel
  async duplicateFunnel(id) {
    await this.updateHeader();
    try {
    return this.http.post(this.funnelBaseUrl+'/duplicateFunnel?id='+id,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

 // API request to create a duplicate of a existing funnel
 async changeFunnelPublicPrivate(funnel) {
  await this.updateHeader();
  try {
  return this.http.post(this.funnelBaseUrl+'/updateFunnel',funnel, this.options).toPromise();
} catch(error) {
  this.errorHandler(error);
};
}

// API request to create a duplicate of a existing funnel
async getFunnelWhenOptions() {
  // await this.updateHeader();
  try {
  return this.http.get(this.baseURL+'/automationRules/listRules').toPromise();
} catch(error) {
  this.errorHandler(error);
};
}

setEmailCampaignIdForWQ(funnelData) {
  let quizEc = funnelData.quiz.quizAutomationRules.filter(item => {
    return item.automationThenDtl.description.includes("Subscriobe to an email sequence") && item.isDefault
  });
  let webinarEc = funnelData.webinar.webinarAutomationRules.filter(item => {
    return item.automationThenDtl.description.includes("Subscriobe to an email sequence") && item.isDefault
  });
  //debugger;
  // the following ids are used for getting email campaign id when user clicks on edit option of quiz/webinar email sequence fragement
 // localStorage.setItem("quizEcId", quizEc[0].thenEmailCampId);
  //localStorage.setItem("webinarEcId", webinarEc[0].thenEmailCampId);
}

// API request to save automation rule
async saveAutomationRules(automationRule,autoMationRuleFor) {
   await this.updateHeader();
   var url = this.baseURL+'/automationRules';
  // if(autoMationRuleFor == 'quiz'){
  //     url = url +'/addEditQuizRules'
  // }else{
  //   url = url +'/addEditWebinarRules'
  // }
  url = url+"/addEditMappedRules?moduleName="+autoMationRuleFor;
  try {
  return this.http.post(url,automationRule,this.options).toPromise();
} catch(error) {
  this.errorHandler(error);
};
}

// API request to delete automation rule
async deleteAutomationRules(id) {
  await this.updateHeader();
 try {
    return this.http.post(this.baseURL+'/automationRules/deleteRule?id='+id,{},this.options).toPromise();
    } catch(error) {
    this.errorHandler(error);
    };
}
   // handler to handel any server error
  errorHandler(error) {
    console.log("err found", error);

    if (error['_body']) {

      let e = JSON.parse(error['_body']);

      if(e.error == 'invalid_token'){
        //localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
        this.router.navigate(['/login']);
      }
    }
  }
}

