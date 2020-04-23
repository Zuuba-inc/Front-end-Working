import { Injectable, EventEmitter } from '@angular/core';
import { quizConfiguration } from 'src/app/components/coach/quiz-setup/quiz-setup.component';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Common } from '../../global/common';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizConfigureserviceService {

  // Observable string sources
  private quizConfObs = new Subject<string>();

  // Observable string streams
  quizConfObstream$ = this.quizConfObs.asObservable();

  // Service message commands
  setQuizConfObs(quizConfObj: string) {
    this.quizConfObs.next(quizConfObj);
  }

  quizConfiguration :any = {
    // allowSocialSharing:	true,
    // fontColor:	"",
    // fontLightDark:	"",
    // fontName: "",
    // id: "",
    // isPvtPub:	true,
    // mainUser: {},
    multiVariationNo:	1,
    // quizCallActionLabel:	"",
    // quizColorScheme:	[],
    // quizDescription: "",
    // quizLeadCaptureInfo: {
    //   "callActionLabel": "",
    //   "headline": "",
    //   "headlineDesc": ""
    // },
    // quizMediaAttached: "",
    // quizName: "",
    // quizOutcomes: [],
    // quizQuestions:	[],
    // quizSEOMetadata:	{
    //   "seoImage":	"",
    //   "seoMetaDesc":	"",
    //   "seoMetaTitle":	""
    // },
    // quizTitle: "",
    // registeredUser:	[],
    // status:	"",
    // webinarCategoryId:	integer($int64),
    // webinarSubCategoryId	string,
    };
    quizList:any;
    
  baseURL = this.common.baseurl;
  quizId:any;
  selectedAnswer = [];

  quizConfChange: EventEmitter<number> = new EventEmitter();

  constructor(private http: HttpClient,private common : Common) { }
  
  change(quizObj, moduleName?: string){
    this.quizConfiguration.moduleStatus = quizObj.moduleStatus;
    if(!moduleName){
      this.quizConfiguration = quizObj;
      if(this.quizConfiguration.colorSchemeObj != null){ 
      if(Object.keys(this.quizConfiguration.colorSchemeObj).length > 0){
        this.quizConfiguration.colorSchemeObj = quizObj.colorSchemeObj;
      }else{
        this.quizConfiguration.colorSchemeObj = {"WelcomePage": [], "LeadCapture": [], "OutcomePage": [], "Quiz": []};
      }
    }else{
      this.quizConfiguration.colorSchemeObj = {"WelcomePage": [], "LeadCapture": [], "OutcomePage": [], "Quiz": []};
    }
    }else{
        if(moduleName == 'WelcomePage'){
          this.quizConfiguration.createdon = quizObj.createdon;
          this.quizConfiguration.lastUpdate = quizObj.lastUpdate;
          this.quizConfiguration.allowSocialSharing = quizObj.allowSocialSharing;
          this.quizConfiguration.quizDescription = quizObj.quizDescription;
          this.quizConfiguration.quizMediaAttached = quizObj.quizMediaAttached;
          this.quizConfiguration.quizTitle = quizObj.quizTitle;
          this.quizConfiguration.quizCallActionLabel = quizObj.quizCallActionLabel;
        }else if(moduleName == 'Outcome'){
          this.quizConfiguration.quizOutcomes = quizObj.quizOutcomes
        }else if(moduleName == 'Question'){
          if(!quizObj.quizQuestions || quizObj.quizQuestions == undefined){
            this.quizConfiguration.quizQuestions = [];
          }else{
            this.quizConfiguration.quizQuestions = quizObj.quizQuestions;
          }
          this.quizConfiguration.multiVariationNo = quizObj.multiVariationNo;
        }else if( moduleName == 'Lead Capture'){
          this.quizConfiguration.quizLeadCaptureInfo = quizObj.quizLeadCaptureInfo;
        }else if( moduleName == 'Quiz Design'){
          this.quizConfiguration.fontColor = quizObj.fontColor;
          this.quizConfiguration.fontLightDark = quizObj.fontLightDark;
          this.quizConfiguration.fontName = quizObj.fontName;
          if(this.quizConfiguration.colorSchemeObj != null){ 
            if(Object.keys(this.quizConfiguration.colorSchemeObj).length > 0){
              this.quizConfiguration.colorSchemeObj = quizObj.colorSchemeObj;
            }else{
              this.quizConfiguration.colorSchemeObj = {"WelcomePage": [], "LeadCapture": [], "OutcomePage": [], "Quiz": []};
            }
          }else{
            this.quizConfiguration.colorSchemeObj = {"WelcomePage": [], "LeadCapture": [], "OutcomePage": [], "Quiz": []};
          }
          
          this.quizConfiguration.quizColorSchem = quizObj.quizColorSchem;
        }else if( moduleName == 'Settings'){
          this.quizConfiguration.quizSEOMetadata = quizObj.quizSEOMetadata;
        }
    }
      // console.log(this.quizConfiguration);
  }

  getConfigurationObj()
  {
    return this.quizConfiguration;
  }

  getConfigurationObjOb() {
      return this.quizConfiguration;
  }
  
  async getDefaultColor() {
    
    return await this.http.get(this.baseURL+"/getDefaultColor").toPromise();
  }

  storeSelectedAnswers(questionId, answer){
    //var answerId = 
    var index = this.selectedAnswer.findIndex(e => e.questionId == questionId)
    if (index == -1){
      this.selectedAnswer.push({'questionId': questionId, 'selectedAns':{ 'id': answer.id}});
    }
   
  }

  async getStoredAnswer():Promise<any>{
      return this.selectedAnswer;
  }
  setQuizId(quizId)
  {
    this.quizId = quizId;
  }

  getQuizId()
  {
    return this.quizId;
  }

  setQuizList(quizList)
  {
    this.quizList = quizList;
  }

  getQuizList()
  {
    return this.quizList;
  }

  // this funtion return while color if the background color is dark, and return black if the background color is light
  async lightOrDark(color) :Promise<any>{
    var r,g,b;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'
      )
      );

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }
    var hsp;
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

      return '#000000';
    }
    else {

      return '#ffff';
    }
  }

  async getPerceptualBrightness(color)  :Promise<any>{
    color = color.split("#");
    color = color[1];
    var r = parseInt(color.substring(0,2),16);
    var g = parseInt(color.substring(2,4),16);
    var b = parseInt(color.substring(4,6),16);
    return r*2 + g*3 + b;
  }
}
