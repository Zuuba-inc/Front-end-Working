import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebinarConfigureService {

  constructor() { }

  // this is used to handle save api at the time user switching between modules by clicking 
  recentlyUpdatedModule: any;

  // this is set in module, used to update post api url for save at the time of switch
  moduleUrl: any;

  // use this to set saved module in setValidations for updating validations
  savedModule: any;

  // common module status to keep status in sync over save API in all the modules
  moduleStatus: any = {};

  // fromService prepoerty is used to detect page refresh and hit get api functionality

  webinarMst: any = {
    webinarPresentationDetailList: [],
    webinarType: 'live',
    isPrivatePublic: 'Public',
    webinarDesc: "",
    webinarTitle: "",
    webinarLiveDtl:{enableReplay:false},
    // id:74
  };
  
  // webinar-info module
  webinarMstInfo: any = {
    fromService: true,
    webinarDesc: "",
    moduleUrl: "/webinarInfo"
  };

  // webinar-type module
  webinarMstType: any = {
    webinarType: 'live',
    webinarUrl:null,
    webinarLiveDtl:{enableReplay:false,webinarLiveTime:'',replayExpDays:'',replayExpDate:'',webinarLiveDate:''},
    webinarAutoDtl:{eventFrequency:null,webinarAutoDtlTimeList:[{}],eventStartDate:null,enableIntimeReg:false, enableReplay:false},
    // id:null,
    webinarDurationHrs:null,
    webinarDurationMins:null,
    webinarDurationSecs:null,
    fromService: true,
    moduleUrl: "/webinarType"
  };

  // webinar offer module
  webinarMstOffer: any = {
    webinarOffer: {
                    title:"",
                    description:"", 
                    callToActionLabel: "", 
                    offerBtnColor: ""
                  },
    fromService: true,
    moduleUrl: "/webinarOffer"
  };

  webinarMstPresentationVideo: any = {
    fromService: true,
    webinarPresentationDetailList: [],
    moduleUrl: "/webinarPresVideo"
  };

  // webinar chatbox module
  webinarMstChatBox: any = {
    webinarChatDetails: [],
    fromService: true,
    moduleUrl: "/webinarChat"
  };

  getWebinarConfigure()
  {
    return this.webinarMst;
  }

  changeWebinarConfigure(webinar)
  {
    this.webinarMst = webinar;
  }

  resetWebinarConfigure(){
    this.webinarMst = {
      webinarPresentationDetailList: [],
      webinarType: 'live',
      webinarDesc: "",
      webinarTitle: "",
      webinarLiveDtl: { enableReplay: false },
      // id:74
    };
    this.webinarMstInfo= {
      fromService: true,
      webinarDesc: "",
      moduleUrl: "/webinarInfo"
    };
    this.webinarMstType = {
      webinarType: 'live',
      webinarUrl: null,
      webinarLiveDtl: { enableReplay: false, webinarLiveTime: '', replayExpDays: '', replayExpDate: '', webinarLiveDate: '' },
      webinarAutoDtl: { eventFrequency: null, webinarAutoDtlTimeList: [{}], eventStartDate: null, enableIntimeReg: false, enableReplay: false },
      // id:null,
      webinarDurationHrs: null,
      webinarDurationMins: null,
      webinarDurationSecs: null,
      fromService: true,
      moduleUrl: "/webinarType"
    };
    this.webinarMstOffer =  {
      webinarOffer: {
                      title:"",
                      description:"", 
                      callToActionLabel: "", 
                      offerBtnColor: ""
                    },
      fromService: true,
      moduleUrl: "/webinarOffer"
    };

    this.webinarMstPresentationVideo = {
      fromService: true,
      webinarPresentationDetailList: [],
      moduleUrl: "/webinarPresVideo"
    };
  
    // webinar chatbox module
    this.webinarMstChatBox = {
      webinarChatDetails: [],
      fromService: true,
      moduleUrl: "/webinarChat"
    };
  }
}
