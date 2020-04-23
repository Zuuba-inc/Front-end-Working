import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { ScrollEvent } from 'ngx-scroll-event';
//import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';
// import jquery
import * as $ from 'jquery';
import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';
import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';
import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';

import { PDFSource, PDFDocumentProxy } from 'pdfjs-dist';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { NgForm } from '@angular/forms';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation-slides-and-videos',
  templateUrl: './presentation-slides-and-videos.component.html',
  styleUrls: ['./presentation-slides-and-videos.component.css']
})
export class PresentationSlidesAndVideosComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    //throw new Error("Method not implemented.");
    this.webinarPresFileType = "0";
  }

  constructor(private webinarConf: WebinarConfigureService,
    private webinarAPI: WebinarAPIService, private fileUpload: FileUploadAPIService,
    private authService: AuthapiserviceService,
    private router: Router) { }
  require: any;

  // use this to set route active when there is a page reload in websetup file
  module: any = "PresentationVideo";

  // set recently updated property in keyupfunction
  recentlyUpdatedModule: any = "webinarMstPresentationVideo";

  // use this for setting post url 
  moduleUrl: any = "/webinarPresVideo";

  // use this for get parama
  getParam: any = "PresentationVideo";

  contectIndex;
  pdfSrc: string | PDFSource | ArrayBuffer = '';
  videoDuration="";
    canvasLength = 0;
    changedImage = false;
  // or pass options as object
  // pdfSrc: any = {
  //   url: './assets/pdf-test.pdf',
  //   withCredentials: true,
  //// httpHeaders: { // cross domain
  ////   'Access-Control-Allow-Credentials': true
  //// }
  // };
  viewer: PdfViewerComponent;
  error: any;
  page = 1;
  rotation = 0;
  zoom = 0.0;
  originalSize = false;
  pdf: any;
  renderText = true;
  //progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = false;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;
  pdfQuery = '';

  webinarId: any;

  webinarObj: any;

  webinarResObj: any;

  webinarMst: any;

  webinarTypeList = [{ 'id': 'pdf', 'value': 'Presentation Slides' }, { 'id': 'video', 'value': 'Video' }];

  async ngOnInit() {

    // get webinarMstPresentationVideo data from service
    this.webinarTypeObj = this.webinarConf.webinarMstPresentationVideo;

    this.webinarMst = this.webinarTypeObj;

    // get webinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    // console.log("in ngOnInit of wbeinar-chatbox, found webinarId", this.webinarId, "and this.webinarMst", this.webinarMst);

    // // console.log(this.webinarTypeObj.id != undefined);
    // if(this.webinarTypeObj.id != null && this.webinarTypeObj.id != undefined){
    //   this.webinarMst.id = this.webinarTypeObj.id;
    //   var res = this.webinarAPI.getWebinar(this.webinarTypeObj.id, "PresentationVideo").subscribe(data=>{
    //     // console.log('Inside get webinar ' , res);
    //     var webinarObj = JSON.parse(data['_body']);
    //         this.webinarTypeObj = webinarObj.data;
    //     //this.updateRecord();
    //   });
    // webinarTypeList=[{'id':'pdf', 'value':'Presentation Slides'},{'id':'video', 'value':'Video'}];

    // ngOnInit() {

    //   this.webinarTypeObj = this.webinarConf.getWebinarConfigure();
    //   this.webinarPresFileType = "0";
    //   // console.log(this.webinarTypeObj.id != undefined);
    //   if(this.webinarTypeObj.id != null && this.webinarTypeObj.id != undefined){
    //     this.webinarMst.id = this.webinarTypeObj.id;
    //     var res = this.webinarAPI.getWebinar(this.webinarTypeObj.id, "PresentationVideo").subscribe(data=>{
    //       // console.log('Inside get webinar ' , res);
    //       var webinarObj = JSON.parse(data['_body']);
    //       // console.log(webinarObj.data.webinarPresentationDetailList);
    //           this.webinarMst.webinarPresentationDetailList = webinarObj.data.webinarPresentationDetailList;
    //           var i=0;
    //           var cnt =0;
    //           this.webinarMst.webinarPresentationDetailList.forEach(presObj=>{
    //             //setTimeout(() => {
    //               //alert('called *************');
    //               if(presObj.fileType == 'video'){
    //               this.renderVideoCanvas(presObj.filePath,i,cnt);
    //               i= i +1;  
    //             }
    //               cnt= cnt+1;

    //           });
    //       //this.updateRecord();
    //     });

    // }

    // set webinar id if it exists
    if (this.webinarId) {

      this.webinarMst.id = this.webinarId;
    }

    //this.cookie.delete('access_token','/');
    //localStorage.removeItem("token");
    // console.log(JSON.parse(this.authService.getToken()));
    // console.log(JSON.parse(localStorage.getItem('currentUser')));

    if (this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    }

    // webinarId exists, get data based on webinarId and store in webinarservice
    // and on page refresh make an api if data does not exist in webinarservice
    // this is used for page refresh handling
    if (this.webinarMst && (this.webinarMst.fromService == true)
      && this.webinarId) {

      // if webinarMst is empty on service like in  case of page refresh
      // and webinarId exists make an API call
      // get data from webinar service
      let dataQuiz: any =  await this.webinarAPI.getWebinar(this.webinarId, "PresentationVideo")
      // .subscribe(dataQuiz => {
        // console.log(dataQuiz);
        if (dataQuiz) {
        var webinar = dataQuiz;
        if (webinar.status == 'SUCCESS') {

          this.webinarResObj = webinar.data;

          // console.log('this // console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          // console.log(this.webinarObj);

          // this.webinarConfigureService.changeWebinarConfigure(this.webinarResObj);

          // set webinar chatbox module data from GET API response into service
          this.webinarConf.webinarMstPresentationVideo = this.webinarResObj;

          this.webinarConf.webinarMstPresentationVideo.moduleUrl = this.moduleUrl;

          // set only webinarChatDetails module data from service 
          this.webinarMst = this.webinarConf.webinarMstPresentationVideo;

          // console.log("this.webinarMst initialized in chat-box should only contain this module relevant data", this.webinarMst);

          // var res = this.webinarAPI.getWebinar(this.webinarTypeObj.id, "PresentationVideo").subscribe(data=>{
          //   // console.log('Inside get webinar ' , res);
          // var webinarObj = JSON.parse(data['_body']);
          // // console.log(webinarObj.data.webinarPresentationDetailList);
          // this.webinarMst.webinarPresentationDetailList = webinarObj.data.webinarPresentationDetailList;
          var i = 0;
          var cnt = 0;
          this.webinarMst.webinarPresentationDetailList.forEach(presObj => {
            //setTimeout(() => {
            //alert('called *************');
            if (presObj.fileType == 'video') {
              this.renderVideoCanvas(presObj.filePath, i, cnt);
              i = i + 1;
            }
            cnt = cnt + 1;

            // });
            //this.updateRecord();
          });

        }
      }
      // })
    } else {
      // data exists in service, then don't make API call.
      if (this.webinarMst && this.webinarMst.id) {

        if (this.webinarConf.webinarMstPresentationVideo) {
          // set only webinarChatDetails module data from service 
          this.webinarObj = {};
          this.webinarObj = this.webinarConf.webinarMstPresentationVideo;
          this.webinarMst = this.webinarObj;
          // console.log("this.webinarMst initialized in chat-box should only contain this module relevant data", this.webinarMst);
        }
      }
    }

  }
  webinarPresFileType: any = "pdf";
  presentation: any = 'presentation';
  webinarTypeObj;
  webinarPresFileName: any;
  // webinarMst = {
  //   webinarType: 'live',
  //   webinarUrl:null,
  //   webinarPresentationDetailList:[],
  //   id:null,
  //   webinarDurationHrs:null,
  //   webinarDurationMins:null,
  //   webinarDurationSecs:null
  // };;
  @ViewChildren('videoCanvas') videoCanvas: QueryList<ElementRef>;
  @ViewChildren('pdfCanvas') pdfCanvas: QueryList<PdfViewerComponent>;

  currentPresId: any;
  webinarPresFilePath: any; pdfPages;
  webinarPresFileObj;
  @ViewChild('webinarPresentationForm') webinarPresentationForm: NgForm;
  //webinarPresentationArray=[{}];

  // output event function of file upload
  onFileUpload(event: any) {
    // console.log("this is the result of emitted output from upload-file component, uploaded file is", event.croppedImage);
    // update this component croppedImage binding with received image
    // this.croppedImage = event.croppedImage;
    this.changedImage = true;
    this.webinarPresFileObj = event.file;
  }

  async addUpdatePresentation() {
    if(this.changedImage){
    let data:any = await this.fileUpload.uploadOutcomeImageToAmazonServer(this.webinarPresFileObj);
    var res = data;
    // console.log(res);
    this.webinarPresFilePath = res.message;
    }
    //this.apiresponse = res;
    await this.webinarMst.webinarPresentationDetailList.push({"fileType": this.webinarPresFileType, 
    "fileName": this.webinarPresFileName, "filePath":res.message, 
    "videoDuration" : this.videoDuration, "pdfPages":this.pdfPages});
    //// console.log('hello : '+ this.pdfCanvas.length);
    // console.log(this.webinarMst.webinarPresentationDetailList);
    await this.submitWebinar();
    await this.updatePresentationImage();
    this.resetPresentForm();
    $('.presScroll').scrollTop(0);
  }

  editWebinarPresentation(index) {
    this.currentPresId = index;
    $('.presScroll').scrollTop(0);

    var webinarPres = this.webinarMst.webinarPresentationDetailList[index];
    alert(webinarPres.fileType);
    this.webinarPresFileType = webinarPres.fileType;
    this.webinarPresFileName = webinarPres.fileName;
    this.webinarPresFilePath = webinarPres.filePath;
    //alert('this.videoDuration helllo : ' + this.videoDuration);
    this.videoDuration = webinarPres.videoDuration;
    this.pdfPages = webinarPres.pdfPages;
    if (webinarPres.fileType == 'video') {
      for (var i = 0; i <= index; i++) {
        if (this.webinarMst.webinarPresentationDetailList[i].fileType == 'pdf')
          index = index - 1;
      }
    }
    this.canvasLength = index;
    $('#slideAdd').hide();
    $('#slideEdit').show();
  }
  
  resetPresentForm(){
    this.webinarPresentationForm.form.markAsPristine();
    this.webinarPresentationForm.form.markAsUntouched()
  }

  async editWebinarPresentationList()
	{
			
				
        var webinarPresId = this.currentPresId;
       
        if(this.changedImage){
          var res:any = await this.fileUpload.uploadOutcomeImageToAmazonServer(this.webinarPresFileObj);
       
        // console.log(res);
        this.webinarPresFilePath = res.message;
        }
        this.webinarMst.webinarPresentationDetailList[this.currentPresId].fileType= this.webinarPresFileType; 
        this.webinarMst.webinarPresentationDetailList[this.currentPresId].fileName= this.webinarPresFileName;
        this.webinarMst.webinarPresentationDetailList[this.currentPresId].filePath=res.message;
        this.webinarMst.webinarPresentationDetailList[this.currentPresId].videoDuration=this.videoDuration;
        this.webinarMst.webinarPresentationDetailList[this.currentPresId].pdfPages=this.pdfPages;
        await this.submitWebinar();
        if(this.webinarPresFileType == 'pdf')
        {
          // console.log('this.canvasLength : '+ this.webinarPresFileType  + ' : '+this.webinarMst.webinarPresentationDetailList.length);
          //$('#pdfSrc'+ this.canvasLength).src=URL.createObjectURL(this.webinarPresFileObj);     
          //this.renderPdfCanvas(this.webinarPresFilePath,index);
          var i=0;
          var cnt =0;
        this.webinarMst.webinarPresentationDetailList.forEach(presObj=>{
            //setTimeout(() => {
              //alert('called *************');
              if(presObj.fileType == 'video'){
              this.renderVideoCanvas(presObj.filePath,i,cnt);
              i= i +1;  
            }
              cnt= cnt+1;
              
          });
``      }
        else
        {
          setTimeout(() => {
            alert(this.currentPresId);
            this.renderVideoCanvas(URL.createObjectURL(this.webinarPresFileObj),this.canvasLength,this.currentPresId);
          }, 2000);        
            
        }
        this.webinarPresFileType = "";
        this.webinarPresFileName = "";
        this.webinarPresFilePath = null;
        
        this.pdfPages = "";
        this.videoDuration = "";
        $('#slideAdd').show();
        $('#slideEdit').hide();
     
        this.resetPresentForm();
        $('.presScroll').scrollTop(0);
        //document.getElementById('slideAdd').style="display:block;width: 65px;";
        //document.getElementById('slideEdit').style="display:none;width: 67px;";
        
        
  }
  async updatePresentationImage() {
    // console.log('inside updatePresentationImage1   : ' + this.webinarPresFileType);
    var url;
    /*if(this.pdfData !== undefined && presObj == null)
			url = URL.createObjectURL(this.pdfData);
		else*/
    url = this.webinarPresFilePath;
    // console.log(this.viewer);

    //this.viewer.src='/asses/Coach Force.pdf';     
    //this.pdfSrc = URL.createObjectURL(this.webinarPresFileObj);     
    if (this.webinarPresFileType == 'pdf') {
      // console.log('this.canvasLength : ' + this.webinarPresFileType + ' : ' + this.webinarMst.webinarPresentationDetailList.length);
      //$('#pdfSrc'+ this.canvasLength).src=URL.createObjectURL(this.webinarPresFileObj);     
      //this.renderPdfCanvas(this.webinarPresFilePath,index);
      var i = 0;
      var cnt = 0;
      this.webinarMst.webinarPresentationDetailList.forEach(presObj => {
        //setTimeout(() => {
        //alert('called *************');
        if (presObj.fileType == 'video') {
          this.renderVideoCanvas(presObj.filePath, i, cnt);
          i = i + 1;
        }
        cnt = cnt + 1;

      });
    }
    else {
      //alert('video URL : '+this.webinarPresFilePath);
      var i = 0, cnt = 0;
      this.webinarMst.webinarPresentationDetailList.forEach(presObj => {
        //setTimeout(() => {
        //alert('called *************');
        if (presObj.fileType == 'video') {
          this.renderVideoCanvas(presObj.filePath, i, cnt);
          // console.log(this.videoDuration);
          i = i + 1;
        }
        cnt = cnt + 1;
        //}, 2000);
      });
    }
    this.webinarPresFileType = "";
    this.webinarPresFileName = "";
    this.webinarPresFilePath = "";
    this.videoDuration = "";
    this.pdfPages = "";



  }

  async renderVideoCanvas(url, count, listCount) {
    // console.log('inside render video canvas' + this.videoCanvas.length + ' : ' + count);
    var id = '#pdf-image' + count;
    //const canvas: HTMLCanvasElement = $(id);
    this.contectIndex = listCount;
    //// console.log(this.videoCanvas.toArray);
    //let canvas = this.videoCanvas.toArray()[this.videoCanvas.length-1].nativeElement;
    //var context = canvas.getContext('2d');
    var videoObj = document.createElement('video');
    // console.log(videoObj, ' : ', url);
    videoObj.src = url;
    var videoD;
    videoObj.addEventListener('loadedmetadata', this.callEventFunction.bind(this, count));
  }

  async renderPdfCanvas(url, count) {
    // console.log('inside render video canvas' + this.videoCanvas.length + ' : ' + count);
    var id = '#pdf-image' + count;
    //const canvas: HTMLCanvasElement = $(id);
    var viewer;
    for (var i = 0; i <= count; i++) {
      viewer = this.pdfCanvas[i];
    }
    /*this.pdfCanvas.forEach(
          div => {
             
            // console.log(div)
            viewer  = div;
          }
      );*/
    // console.log(url);
    setTimeout(() => {
      viewer.src = url;
      // console.log('inside draw image', viewer);
    }, 2000)



  }


  afterLoadComplete(pdf: PDFDocumentProxy, index) {
    // console.log('after load event called', pdf.numPages, ' : ', index);
    this.webinarMst.webinarPresentationDetailList[index].pdfPages = pdf.numPages;
  }
  pageRendered(event) {
    // console.log('page rendered event called');
  }
  onError(event) {
    // console.log('error event called' + event);
  }

  async submitWebinar() {

    // try {
   
    // get editQuizId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    if (this.webinarId) {
      this.webinarMst.id = this.webinarId;
    }

    // console.log("data being sent to save API in chat box", this.webinarMst);

    // save webinar data
    let moduleUrl = "/webinarPresVideo";

    this.webinarObj = { ...this.webinarMst };

    var webinar:any = await this.webinarAPI.saveWebinar(this.webinarObj, moduleUrl);

    // console.log("found webinar after save", webinar);

    if (webinar.statusCode == 200) {

      // console.log('webinar object', webinar.data, "this.webinarConfigureService.webinarMst after save res", this.webinarConf.webinarMst);

      this.webinarObj = {};
      this.webinarObj = webinar.data;

      this.webinarConf.webinarMstPresentationVideo = this.webinarObj;
      this.webinarMst = this.webinarConf.webinarMstPresentationVideo;

      // console.log("this.webinarObj:", this.webinarObj);

      // delete id from chatDetails array, if exists, for save to work
      // this.webinarObj = this.delIdFromChatDetails(this.webinarObj);

      // if webinarId doesn't exist in session storage, only then set it 
      // (to save data against the same id even after page reload)
      if (!localStorage.getItem("webinarId")) {

        // console.log("webinarId for this SESSION", webinar.data.id);
        localStorage.setItem("webinarId", webinar.data.id);
      }

    }
//   }catch(error) {

//     // stop loader
//     this.loadingScreenService.stopLoading();

//     // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
//     // console.log("error in saving post", error);

//     //if the error is of invalid token type return to login page
//     error = JSON.parse(error['_body']);

//     // console.log("error after parsing", error);

//     if (error.error == "invalid_token") {

//       // redirect to login page iof token is inavlid
//       Swal.fire({
//         text: error.error+", Please login",
//         type: 'warning',

//       }).then((result) => {
//         if (result.value) {

//           // clear everything from locastorage

//           this.router.navigate(['/'])
//         }
//       })

//     }
// }
  }
  callEventFunction(count, event) {
    var context;
    // console.log(this.videoCanvas);
    var i = 0;
    this.videoCanvas.forEach(
      div => {
        // console.log(div.nativeElement, ' : ', count, ' : ', this.contectIndex);
        if (i == count)
          context = div.nativeElement.getContext('2d');
        i = i + 1;
      }
    );
    var video = event.target;
    //alert('meta data loaded **************' + event.target.src + ' : '  + ' : ' + count);
    //videoObj.play();
    //this.videoDuration = video.duration;
    this.webinarMst.webinarPresentationDetailList[this.contectIndex].videoDuration = this.fancyTimeFormat(video.duration);
    // console.log(this.webinarMst.webinarPresentationDetailList[this.contectIndex].videoDuration);
    setTimeout(() => {
      context.drawImage(video, 0, 0, 350, 172);
      // console.log('inside draw image');
    }, 2000)

  }

  fancyTimeFormat(time) {
    // Hours, minutes and seconds
    time = Math.ceil(time);
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + " hours " + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + " mins " + (secs < 10 ? "0" : "");
    ret += "" + secs + " secs ";
    // console.log('return format : ' + ret);
    return ret;
  }
  deleteWebinarPresentation(webinarPres) {
    this.webinarMst.webinarPresentationDetailList.splice(this.webinarMst.webinarPresentationDetailList.indexOf(webinarPres), 1);
    this.submitWebinar();
    var i = 0;
    var cnt = 0;
    this.webinarMst.webinarPresentationDetailList.forEach(presObj => {
      //setTimeout(() => {
      //alert('called *************');
      if (presObj.fileType == 'video') {
        this.renderVideoCanvas(presObj.filePath, i, cnt);
        i = i + 1;
      }
      cnt = cnt + 1;

    });
  }
  goBackToFunnel(){
    var funnelType = localStorage.getItem('funnelUrl')
    this.router.navigate(['/funnelCreate/'+funnelType], { queryParams: {editWebinar: true}});
  }
  goBack()
  {
    this.router.navigate(['/webinarSetup/ChatBox']);
  }

}
