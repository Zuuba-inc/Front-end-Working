import { Injectable } from '@angular/core';

@Injectable()
export class Common {

    //baseurl: String = "https://165.227.113.32:8080";
    baseurl: String = "https://18.220.96.170:8443";
   //baseurl: String = "http://localhost:8080";
    serverUrl = "https://localhost:4200"
    //serverUrl = "https://165.227.113.32:9443"
    //serverUrl = "https://13.58.59.15";
   // baseurl: String = "http://localhost:8080";
    //baseurl: String ="https://18.220.96.170:8443";
    // baseurl: String = "https://localhost:8443";
    clientApp: String = "clientapp" ;
    clientSecrete : String ="123456";
  
    // allowed image size
    allowedImageSize: any = 2; // this is in MB;

    allowedVideoSize: any = 4; // this is in MB

    googleAppId: any = "647129437466-0rp2359nmcpikfkls8oqsm2uj0teh6tg.apps.googleusercontent.com"; // for google social login

    fbAppId: any = "420363038543010";

    API_KEY:any =45389072;

    CHROME_EXTENSION_ID="moemodeahofkbkadecopbknjoohbmcbc";

    emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    newEmailPattern = /^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!hotmail|gmail|googlemail|yahoo|gmx|ymail|outlook|bluewin|protonmail|t\-online|web\.|online\.|aol\.|live\.)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/;

    urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
}