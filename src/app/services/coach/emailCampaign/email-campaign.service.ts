import { Injectable } from '@angular/core';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Common } from '../../global/common';
import { Router } from '@angular/router';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class EmailCampaignService {

  constructor(   private http :HttpClient,
    private authService: AuthapiserviceService,
    private common: Common,
    private router: Router,) { }
  baseURL = this.common.baseurl;
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public options =({ headers: this.headers });
  authToken;

  async updateHeader(): Promise<void> {
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
      this.authToken = JSON.parse(this.authService.getToken());
      console.log(this.authToken.access_token);
      this.headers = new HttpHeaders()
      .set('Authorization', 'bearer ' + this.authToken.access_token)
      .set('Content-Type', 'application/json'),
      this.options = { headers: this.headers };
    }
  }

  async getDefaultTempelate(templateName) {

    try{ 
      if(templateName == undefined){
        templateName = 1
      }
    return await this.http.get(this.baseURL+"/emailCampaign?tempId="+templateName).toPromise();
    }catch(error) {
      this.errorHandler(error);
    };
  }
  async getAllEmailTempelate() {
    try{ 
    await this.updateHeader();
    return await this.http.get(this.baseURL+"/emailCampaign/listEmailDefaultTemplates",this.options).toPromise();
    }catch(error) {
      this.errorHandler(error);
    };
  }
  async getSpacerData() {
    try{ 
    await this.updateHeader();
    return await this.http.get(this.baseURL+"/emailCampaign/listAllSpacer",this.options).toPromise();
    }catch(error) {
      this.errorHandler(error);
    };
  }
  async saveTemplate(templateData) {

    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/saveEmailCampaign', templateData, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async createEmailCampaign(data) {
    
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/saveEmailCampaign', data, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async getEmailCampaignList(type,pageNo) {

    await this.updateHeader();
    try {
      var campaignTyp;
      if(type == 'Sequence'){
        campaignTyp = 1;
      }else{
        campaignTyp = 2;
      }
    return this.http.get(this.baseURL+'/emailCampaign/getEmailCampaignList?emailCampaignTypeId='+campaignTyp+"&pageNo="+pageNo, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async getEmailCampaign(id, moduleName?: string) {

    await this.updateHeader();
    try {
      var url;
      if(moduleName){
        url = this.baseURL+'/emailCampaign/getEmailCampaign?emailCampId='+id+"&moduleName="+moduleName;
      }else{
        url = this.baseURL+'/emailCampaign/getEmailCampaign?emailCampId='+id
      }
    return this.http.get(url, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async getEmailCampaignTriggers(id) {

    await this.updateHeader();
    try {
      var url = this.baseURL+'/emailCampaign/getEmailCampaignTriggers?emailCampId='+id
    return this.http.get(url, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async getEmailTemplate(id) {

    await this.updateHeader();
    try {
    return this.http.get(this.baseURL+'/emailCampaign/getEmailData?emailId='+id, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async deleteEmailCampaign(id) {

    await this.updateHeader();
    try {
    return this.http.delete(this.baseURL+'/emailCampaign/deleteEmailCampaign?id='+id, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async deleteEmailTemplate(id) {

    await this.updateHeader();
    try {
    return this.http.delete(this.baseURL+'/emailCampaign/deleteEmail?emailId='+id, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async deleteEmailTemplateComponent(id) {

    await this.updateHeader();
    try {
    return this.http.delete(this.baseURL+'/emailCampaign/deleteEmailComponent?componentId='+id, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async getDefaultBackgroundImages() {
    await this.updateHeader();
    try {
    return this.http.get(this.baseURL+'/emailCampaign/getEmailBackgroundImages', this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async getEmailThemes() {
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/getThemeList',{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async saveNewBackgroundImage(path) {
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/saveEmailBackImage?backImagePath='+path,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  
  async getEmailCampRecepients(id, campaignType,pageNo) {
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/getEmailCampRecepients?emailCampaignId='+id+'&emailCampaignTypeId='+campaignType+'&pageNo='+pageNo,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async duplicateEmail(id, title) {
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/duplicateEmailCampaign?emailCampaignId='+id+'&newEmailCampaignTitle='+ title,{}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async saveEmailBroadcastReceipients( receipients ) {
    await this.updateHeader();
    try {
    return this.http.post(this.baseURL+'/emailCampaign/saveEmailBroadcastRecipients',receipients, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  
  async getEmailWhenAndThenRules( ) {
    try {
    return this.http.get(this.baseURL+'/automationRules/listEmailRules').toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async getEmailCampaignForSubscribers( token ) {
    try {
    return this.http.get(this.baseURL+'/emailCampaign/getEmailCampaignsForSuscriber?trackToken='+token).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async unSubscribersFromEmailCampaign( token, emails,tokenType, subscribeValue ) {
    try {
      var url;
      if(tokenType == 'SubscriberToken'){
          url = "/emailCampaign/unsubscribeFromEmailCampaign?subscribe="+subscribeValue+"&subscribeToken="+token;
      }else{
          url = "/emailCampaign/unsubscribeFromEmailCampaign?subscribe="+subscribeValue+"&trackToken="+token;
      }
    return this.http.post(this.baseURL+url,emails,{}).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }

  async subscribersToEmailCampaign( subscribeTokem) {
    try {
    return this.http.get(this.baseURL+'/emailCampaign/subscribeToEmailSeq?subscribeToken='+subscribeTokem).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async updateDataForSubscribedUser( token, email ) {
    try {
    return this.http.get(this.baseURL+'/updateUser?emailAddress='+email+'&subToken='+token).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };

  }
  async getRecentlyEditedEmail(campaignTyp){
    await this.updateHeader();
    try {
    
      return this.http.get(this.baseURL+'/emailCampaign/listRecentlyEditedEmails?emailCampaignType='+campaignTyp,this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  async reportEmailAsSpam(userId){
    try {
      return this.http.get(this.baseURL+'/emailCampaign/reportAsSpam?userId='+userId).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  async getSegmentationData(){
    try {
      await this.updateHeader();
      return this.http.get(this.baseURL+'/emailCampaign/getEmailSegmentations',this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async getBroadcastEmails(){
    try {
      await this.updateHeader();
      return this.http.get(this.baseURL+'/emailCampaign/getBroadcastEmails',this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async getSequenceEmails (){
    try {
      await this.updateHeader();
      return this.http.get(this.baseURL+'/emailCampaign/getSEquenceEmails',this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async saveBroadCastFilters (filters){
    try {
      await this.updateHeader();
      return this.http.post(this.baseURL+'/emailCampaign/filterBroadcastRecipients',filters ,this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async deleteDynamicValue (id){
    try {
      await this.updateHeader();
      return this.http.delete(this.baseURL+'/emailCampaign/deleteDynamicValue?dynamicIds='+id ,this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async deleteAllBroadCastFilters (id){
    try {
      await this.updateHeader();
      return this.http.get(this.baseURL+'/emailCampaign/clearAllFilters?emailCampaignMstId='+id ,this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }
  async getDashboardCount(emailId, countType ?: string, endDate ?: string ){
    try {
      await this.updateHeader();
      var query = "emailCampId="+emailId;
      if(countType){
        query = query+"&countType="+countType;
      }
      return this.http.get(this.baseURL+'/emailCampaign/getBroadCastEmailStats?'+query ,this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  errorHandler(error) {
    console.log("err found", error);
    if (error['_body']) {

      let e = JSON.parse(error['_body']);

      if(e.error == 'invalid_token'){
        //localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
        this.router.navigate(['/login']);
      }else{
        Swal.fire({
          text: e.error ,
          type: 'warning',
  
        })
      }
    }
  }
}
