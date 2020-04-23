import { Injectable } from '@angular/core';
import { FunnelService } from '../funnel/funnel.service';
import {WebinarAPIService} from '../webinar/webinar-api.service';
import {QuizapiserviceService} from '../quiz/quizapiservice.service';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class FunnelConfigService {

  funnelList:any;
  activeFunnel:any;
  draftFunnel:any;
  archiveFunnel:any; 
  funnelPage = 0;
  activePage = 0;
  draftPage = 0;
  archivePage = 0;
  webinarList = [];
  quizList = [];
  constructor( public funnelService: FunnelService,
              public webinarService : WebinarAPIService,
              public quizService : QuizapiserviceService) { }

  async getFunnel(page, funnelType) : Promise<any>{
    var funnelsListData:any;
    
    if((this.funnelList == undefined || this.funnelPage != page) &&  funnelType == null ){
      console.log(this.funnelPage+":"+ page+":"+funnelType)
      this.funnelPage = page;
        funnelsListData = await this.funnelService.getFunnelsList(page);
      if(funnelsListData.status == 'SUCCESS'){
            this.funnelList = funnelsListData.data;
            return this.funnelList;
      }else{
          this.serverError(funnelsListData);
      }
    }else if((this.activeFunnel == undefined || this.activePage != page) && funnelType == 'Active' ){
      console.log(this.activePage+":"+ page+":"+funnelType)
      this.activePage = page;
      funnelsListData = await this.funnelService.getFunnelsList(page, funnelType);
      if(funnelsListData.status == 'SUCCESS'){
          this.activeFunnel = funnelsListData.data;
          return this.activeFunnel;
       
        }else{
            this.serverError(funnelsListData);
        }
    }else if((this.draftFunnel == undefined || this.draftPage != page ) && funnelType == 'Draft'){
      console.log(this.draftPage+":"+ page+":"+funnelType)
      this.draftPage = page;
      funnelsListData = await this.funnelService.getFunnelsList(page, funnelType);
      if(funnelsListData.status == 'SUCCESS'){
        this.draftFunnel = funnelsListData.data;
        return this.draftFunnel;
     
      }else{
          this.serverError(funnelsListData);
      }
    }else if((this.archiveFunnel == undefined || this.archivePage != page ) && funnelType == 'Archive'){
      console.log(this.archivePage+":"+ page+":"+funnelType)
      this.archivePage = page;
      funnelsListData = await this.funnelService.getFunnelsList(page, funnelType);
      if(funnelsListData.status == 'SUCCESS'){
        this.archiveFunnel = funnelsListData.data;
        return this.archiveFunnel;
      }else{
          this.serverError(funnelsListData);
      }
    }else{
      if(funnelType == 'Active'){
        return this.activeFunnel;
      }else if(funnelType == 'Draft'){
        return this.draftFunnel;
      }else if(funnelType == 'Archive'){
        return this.archiveFunnel;
      }else{
        return this.funnelList;
      }
    }
  }

  addItemInList(type, item){
    if(type == 'Active'){
      if(this.activeFunnel != undefined)
      this.activeFunnel.content.push(item)
    }else if(type == 'Draft'){
      if(this.draftFunnel != undefined)
      this.draftFunnel.content.push(item);
    }else if(type == 'Archive'){
      if(this.archiveFunnel != undefined)
      this.archiveFunnel.content.push(item);
    }
  }
  removeItem(type, item){
    if(type == 'Active'){
      if(this.draftFunnel != undefined){
      var foundIndex = this.draftFunnel.content.findIndex(x => x.id == item.id);
      console.log("Draft Index: "+foundIndex)
      this.draftFunnel.content.splice(foundIndex,1)
    }
    }else if(type == 'Draft'){
      if(this.activeFunnel != undefined){
      var foundIndex = this.activeFunnel.content.findIndex(x => x.id == item.id);
      console.log("Active Index: "+foundIndex)
      this.activeFunnel.content.splice(foundIndex,1)
      }
    }else if(type == 'Archive'){
      if(this.draftFunnel != undefined){
      var draftFoundIndex = this.draftFunnel.content.findIndex(x => x.id == item.id);
      console.log("Archive Draft Index: "+foundIndex)
      this.draftFunnel.content.splice(draftFoundIndex,1)
      }
      if(this.activeFunnel !=undefined ){
        var activeFoundIndex = this.activeFunnel.content.findIndex(x => x.id == item.id);
        console.log("Archive Active Index: "+foundIndex)
        this.draftFunnel.content.splice(activeFoundIndex,1)
      }

    }
  }
  async getWebinarList(): Promise<any>{
    if(this.webinarList.length == 0){
      var response:any = await this.webinarService.getWebinarList('all');
   if(response.status == 'SUCCESS'){
     console.log(response)
     this.webinarList = response.data;
     return this.webinarList;
   }else{
     this.serverError(response);
     return this.webinarList;
   }
    }else{
      return this.webinarList
    }
  }
  async updateWebinarList(webinar): Promise<any>{
    if(this.webinarList.length > 0){
      var foundIndex = this.webinarList.findIndex(x => x.id == webinar.id);
      console.log("Draft Index: "+foundIndex)
      if(foundIndex >= 0){
        this.webinarList[foundIndex] = webinar;
      }else{
        this.webinarList.push(webinar);
      }
    }
  }

  async updateQuizList(quiz){
    if(this.quizList.length > 0){
      var foundIndex = this.quizList.findIndex(x => x.id == quiz.id);
      console.log("Draft Index: "+foundIndex)
      if(foundIndex >= 0){
        this.quizList[foundIndex] = quiz;
      }else{
        this.quizList.push(quiz);
      }
    }
   
  }
  async getQuizList(): Promise<any>{
    if(this.quizList.length == 0){
      var response:any = await this.quizService.getPublishedQuiz();
   if(response.status == 'SUCCESS'){
     console.log(response)
     this.quizList = response.data;
     return this.quizList;
   }else{
     this.serverError(response);
   }
    }else{
      return this.quizList
    }
  }
//Handeler that handels erorr if the status code of the api is not SUCCESS
    serverError(data){
      Swal.fire({
        text: data.message,
        type: 'warning',
  
      });
  }
}
