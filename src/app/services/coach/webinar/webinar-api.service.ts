import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Common } from '../../global/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isUndefined } from 'util';
import {HttpClient,HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WebinarAPIService {

  constructor(
    // private http: Http,
    private http :HttpClient,
    private authService: AuthapiserviceService,
    private common: Common,
    private router: Router,
  ) { }

  baseURL = this.common.baseurl;
  webinarBaseUrl = this.baseURL + "/quiz"
  // public headers = new Headers({ 'Content-Type': 'application/json' });
  // public options = new RequestOptions({ headers: this.headers });

  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public options =({ headers: this.headers });
  authToken;

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
      .set('Content-Type', 'application/json'),
      this.options = { headers: this.headers };
      // if (this.headers.get('Authorization') == null) {
      //   // this.headers.append('Authorization', 'bearer ' + this.authToken.access_token);
      //   // // this.headers.append('Authorization', 'bearer ' + "inavlidtokenrandowmylput");
      //   // this.options = new RequestOptions({ headers: this.headers });
      //   // return 1;
      // }

    }
  }

  async saveWebinar(webinarObject, moduleUrl?) {

    this.webinarBaseUrl = '';

    // TODO: REMOVE 'ERR' FROM LINK, WAS USED FOR TESTING TRY/CATCH
    this.webinarBaseUrl = this.baseURL + "/webinar" + moduleUrl;

    console.log("webinarObject in saveWebinar Service", webinarObject, "making a post req for webinar with webinar url as", this.webinarBaseUrl);

    await this.updateHeader();

    try  
    { 
    return await this.http.post(this.webinarBaseUrl, webinarObject, this.options).toPromise()
      // .then(result => {
      //   console.log('From save webinar Promise:', result);
      // })
    } catch(error) {

        this.errorHandler(error);

      };

  }

  async deleteChatBoxByid(webinarObject, moduleUrl?) {
    this.webinarBaseUrl = '';

    this.webinarBaseUrl = this.baseURL + "/webinar/deleteChat?id=" + webinarObject.id;

    console.log("webinarObject in saveWebinar Service", webinarObject, "making a post req for webinar with webinar url as", this.webinarBaseUrl);

    await this.updateHeader();

    try  
    {
      return await this.http.delete(this.webinarBaseUrl, this.options).toPromise();
    } catch(error) {
      
      this.errorHandler(error);

    };

  }

  async saveWebinarType(webinarObject) {
    // const uploadUrl = 'http://165.227.113.32:8080/quiz';
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //   console.log('save api');
    //   options.headers.append('Content-Type', 'application/json');
    //  options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
    this.webinarBaseUrl = '';

    this.webinarBaseUrl = this.baseURL + "/webinar/webinarType";

    console.log("webinarObject in saveWebinar Service", webinarObject);

    await this.updateHeader();

    try  
    {
    return await this.http.post(this.webinarBaseUrl, webinarObject, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };

  }

  async getWebinar(webinarId, moduleName?) {
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar?moduleName=" + moduleName + "&id=" + webinarId
    var user:any  = JSON.parse(localStorage.getItem("currentUser"));
    
     if(user != null || user != undefined){
      this.webinarBaseUrl  = this.webinarBaseUrl +"&userId="+user.id; 
     }
    try  
    {
    return await this.http.get(this.webinarBaseUrl).toPromise();
  } catch(error) {
      
    console.log("err trigerred in getWebinar", error);

    this.errorHandler(error);

  };
  }
  async getWebinarReplay(webinarId, timeSlot){
    try  
    {  
      var dt = new Date(timeSlot);
      await this.updateHeader();
      if(timeSlot != null){
        var eventDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
        return await this.http.get(this.baseURL + "/getWebinarReplay?id=" + webinarId+"&webinarTime="+eventDate, this.options)
      .toPromise()
      }else{
        return await this.http.get(this.baseURL + "/getWebinarReplay?id=" + webinarId, this.options)
        .toPromise()
      }
    }  
    catch(error)  
    {  
      // let e = JSON.parse(error['_body']);
      // if(e.error == 'invalid_token'){
      //   localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
      //   this.router.navigate(['/login']);
      // }

      this.errorHandler(error);

    } 
  
  }
  async getWebinarAsync(webinarId, moduleName?) {
    // const uploadUrl = 'http://165.227.113.32:8080/quiz?id='+quizId;
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //  // console.log('save api');
    // options.headers.append('Content-Type', 'application/json');
    // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar"
    try {
    return await this.http.get(this.webinarBaseUrl + "?moduleName=" + moduleName + "&id=" + webinarId, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }


  // use this function to get session and dynamically create token
  async getOTSessionId(webinarId) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/streamWebinar?webinarId=" + webinarId;
    // return this.http.post(this.webinarBaseUrl, {}, this.options);
    await this.updateHeader();
    // if(this.authService.getToken() != null){
    //   this.authToken = JSON.parse(this.authService.getToken());
    //   console.log(this.authToken.access_token);
    //    this.headers.append('Authorization', 'bearer ' + this.authToken.access_token);
    //    this.options = new RequestOptions({ headers: this.headers });
    // }

    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async getWebinarStatus(webinarId) {
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/publishWebinar?webinarId=" + webinarId;
    try {
    return await this.http.get(this.webinarBaseUrl, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }

  async getTimeZoneList() {
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/listTimezones"
    try {
    return await this.http.get(this.webinarBaseUrl, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }

  async getYoutubeData(yt_video_id) {

    try {
    return await this.http.get('https://www.googleapis.com/youtube/v3/videos?id=' + yt_video_id + '&part=contentDetails&key=AIzaSyA-1io3G9C8XiCoiRc2vsoKIEcz4tqFuDE').toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }

  async getVimeoData(yt_video_id) {
    
    this.headers = new HttpHeaders()
         .set('Authorization', 'bearer ' + this.authToken.access_token)
         .set('Content-Type', 'application/json'),
         this.options = { headers: this.headers };
    try {
    var returnVal = await this.http.get('https://api.vimeo.com/videos/' + yt_video_id, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  this.headers.delete('Authorization');
    this.updateHeader();
    return returnVal;
  }

  async recordWebinarUser(webinarId, userId, webinarTime, isInTimReg, timezone?) {
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/recordUser"
    var dt = new Date(webinarTime);
    var eventDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
    alert(eventDate);

    let data;

    try {
    if(isUndefined(timezone))
      data = this.http.get(this.webinarBaseUrl + "?userId=" + userId + "&webinarId=" + webinarId + "&webinarTime=" + eventDate + "&isInTimReg=" + isInTimReg).toPromise();
    else
      data = this.http.get(this.webinarBaseUrl + "?userId=" + userId + "&webinarId=" + webinarId + "&webinarTime=" + eventDate + "&isInTimReg=" + isInTimReg + "&timezone="+timezone).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };  
    return data;
  }

  async checkWebinarStatus(webinarId, userId) {
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/previewWebinar"
    await this.updateHeader();

    let data;

    try {
    data = this.http.post(this.webinarBaseUrl + "?userId=" + userId + "&webinarId=" + webinarId, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
    return data;
  }

  async generateToken(webinarId, userId, timeSlot) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    await this.updateHeader();
    if (timeSlot == null) {
      this.webinarBaseUrl = this.baseURL + "/webinar/generateToken?userId=" + userId + "&webinarId=" + webinarId;
    } else {
      var dt = new Date(timeSlot);
      var eventDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
      this.webinarBaseUrl = this.baseURL + "/webinar/generateToken?userId=" + userId + "&webinarId=" + webinarId + "&timeslot=" + eventDate;
    }
    try {
    return this.http.get(this.webinarBaseUrl).toPromise();
    } catch(error) {
        
      this.errorHandler(error);

    };

  }
  async streamWebinar(webinarId, userId) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/streamWebinar?userId=" + userId + "&webinarId=" + webinarId;
    await this.updateHeader();
    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async archiveWebinar(webinarId) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/streamArchive?webinarId=" + webinarId;
    await this.updateHeader();
    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async stopArchiveWebinar(webinarId, noOfJoinee, watchedUser, timeslot) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    var messageDate = null;
    var t = new Date(timeslot)
    if(timeslot != null)
       messageDate = t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes();
    if(timeslot != null)
      this.webinarBaseUrl = this.baseURL+"/webinar/endWebinar?webinarId="+webinarId+"&noOfJoinee="+noOfJoinee+"&watchedUser="+watchedUser+"&timeslot="+messageDate;
    else
    this.webinarBaseUrl = this.baseURL+"/webinar/endWebinar?webinarId="+webinarId+"&noOfJoinee="+noOfJoinee+"&watchedUser="+watchedUser+"&timeslot=null";
    await this.updateHeader();
  //   try {
  //   return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  // } catch(error) {
      
  //   this.errorHandler(error);

  // };

  try {
    var returnObj = this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
    console.log(returnObj);
    return returnObj;
  } catch(error) {
      
      this.errorHandler(error);
  
    };
  }
  
  async saveMessages(webinarId, data, eventTime) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    var date = new Date();
    var messageDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    var evDate = new Date(eventTime);
    var eventDate = evDate.getFullYear() + "-" + (evDate.getMonth() + 1) + "-" + evDate.getDate() + " " + evDate.getHours() + ":" + evDate.getMinutes();
    this.webinarBaseUrl = this.baseURL + "/webinar/saveMessage?messageDate=" + messageDate + "&webinarId=" + webinarId + "&eventDate=" + eventDate;
    await this.updateHeader();
    try {
    return this.http.post(this.webinarBaseUrl, data, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async saveLikes(webinarId, msgId, userId) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    // var date = new Date();
    // var messageDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
    this.webinarBaseUrl = this.baseURL + "/webinar/likeMessage?messageId=" + msgId + "&userId=" + userId + "&webinarId=" + webinarId;
    await this.updateHeader();
    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async getWebinarMessages(webinarId, date) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    var evDate = new Date(date);
    var eventDate = evDate.getFullYear() + "-" + (evDate.getMonth() + 1) + "-" + evDate.getDate() + " " + evDate.getHours() + ":" + evDate.getMinutes();
   
    await this.updateHeader();
    this.webinarBaseUrl = this.baseURL+"/webinar/getWebinarMessages?eventDate="+eventDate+"&webinarId="+webinarId;
    try {
    return this.http.get(this.webinarBaseUrl, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }

  async saveLiveWebinarStartTime(webinarId, webinarTime, webinarResumeTime) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/saveLiveWebinarStartTime?webinarId=" + webinarId + "&webinarTime=" + webinarTime + "&webinarResumeTime=" + webinarResumeTime;
    await this.updateHeader();

    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }
  async saveLiveWebinarPauseTime(webinarId, webinarPauseTime) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    this.webinarBaseUrl = this.baseURL + "/webinar/saveLiveWebinarPauseTime?webinarId=" + webinarId + "&webinarPauseTime=" + webinarPauseTime;
    await this.updateHeader();

    try {
    return this.http.post(this.webinarBaseUrl, {}, this.options).toPromise();
  } catch(error) {
      
    this.errorHandler(error);

  };
  }

  countUser(webinarId, action, timeSlot) {
    try{
    var dt = new Date(timeSlot);
    var eventDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
    return this.http.get(this.baseURL + "/countUSers?userAction=" + action + "&webinarId=" + webinarId+"&webinarTime="+eventDate);
  } catch(error) {
      
    this.errorHandler(error);

  };
  }



  async getWebinarList(status?: string) {
    // http://165.227.113.32:8080/webinar/streamWebinar?webinarId=454
    this.webinarBaseUrl = '';
    if(status)
    this.webinarBaseUrl = this.baseURL + "/webinar/listWebinar?webinarStatus=" + status;
    else
    this.webinarBaseUrl = this.baseURL + "/webinar/listWebinar?webinarStatus=All";
    // var date = new Date();
    // var messageDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
    
    await this.updateHeader();

    try {
    return this.http.get(this.webinarBaseUrl, this.options).toPromise();
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
      }
    }
  }

}
