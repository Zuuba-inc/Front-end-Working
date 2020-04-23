import { Component, OnInit, ChangeDetectorRef, AfterViewInit, EventEmitter, Input, Output ,SimpleChange} from '@angular/core';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { FileUploadAPIService } from '../../../../../../services/coach/global/file-upload-api.service';
import { Options } from 'ng5-slider';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute  } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Common } from '../../../../../../services/global/common';
// import jquery
import * as $ from 'jquery';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { elementStart, element } from '@angular/core/src/render3';
import { debug } from 'util';
@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.css']
})
export class EditEmailComponent implements OnInit, AfterViewInit {

  @Input() asSubmodule: any;
  @Output() navigate = new EventEmitter<any>();
  baseUrl = this.common.serverUrl;
  onNavigate(path: any) {
    this.navigate.emit(path);
  }

  constructor(private cdr: ChangeDetectorRef,
    private common: Common,
    public service: EmailCampaignService,
    public fileUploadService: FileUploadAPIService,
    private router: Router,
    private route: ActivatedRoute,
    public emailCommonService: EmailCommonService,
    public commonService: CommonService,
    private ngxService: NgxUiLoaderService) { }
  tags = [];

  sHeight: number = 24;
  sWidth: number = 100;
  sStroke: number = 1;
  sbStyle: any = 'solid';
  defaultTempelate = [];
  fontSize = 12;
  options: Options = {
    floor: 8,
    ceil: 50,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  sOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  sStrOptions = {
    floor: 0,
    ceil: 10,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  charSpacing: number = 0.5;
  charSpacingOptions: Options = {
    floor: 0,
    ceil: 5,
    step: 0.1,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  lineSpacing: number = 0.5;
  lineSpacingOptions: Options = {
    floor: 0,
    ceil: 5,
    step: 0.1,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  imageWidth: number = 100
  imageWidthOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  verticalSpacing: number = 0
  verticalSpacingOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  activeSB: any = '';
  tagBeingEdited: any = { style: {} };
  fontList = [
    'Select',
    'Arial',
    'Comic Sans MS',
    'Courier',
    'Georgia',
    'Helvetica',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana'
  ];
  dummy = 0;
  selectedFont = 'Select';
  selectedHeading = '0';
  textBoxCount = 1;
  imageCount = 1;
  buttonCount = 1;
  dividerCount = 1;
  titleCount = 1;
  emailCampaign: any = 'emailCampaign';

  configure: any = 'Image';

  imageUploading = false;
  linkTo;
  linkToWindow = false;
  fontColor;
  backgroundColor;
  tagsRef: any = [];
  headerTag: any = {};
  footerTag: any = {};
  activeTab = '1a';
  hasLogo = false;
  activeradio: any = '1b';
  alignmentMenu = [{ value: 'Left', image: 'assets/icons/text tool/ic_txtleftalign.svg' },
  { value: 'Right', image: 'assets/icons/text tool/txt_rightalign.svg' },
  { value: 'Center', image: 'assets/icons/text tool/txt_centeralign.svg' },
  { value: 'Justify', image: 'assets/icons/text tool/ic_txtcenteralignlong.svg' }]
  backgroundPattern: any = [];
  onImageUploadClick(logo ?: string) {
    if(logo){
      this.configure = 'logoImage'
    }else{
      this.configure = 'Image'
    }
    this.imageUploading = true;
  }

  // output event function of file upload
  croppedImage;
  pdfSrc = null;
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  updateEvents(foundIndex, foundIndex2, event, data) {

    let ele = { ...this.tags[foundIndex].subTags[foundIndex2] };

    // ele.event = event.event;
    ele.src = data.message;
    ele.default = "updated";
    return ele;
  }

  updateColumnModuleWithEvents($e, data) {

    let event = { ...$e };

    let foundIndex: any, foundIndex2: any;

    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];
      if (tag.subTags) {
        for (let j = 0; j < tag.subTags.length; j++) {
          let st = tag.subTags[j];
          if (st.tagId == this.tagBeingEdited.tagId) {
            foundIndex = i;
            foundIndex2 = j;
            break;
          }
        }
      }
      if (typeof foundIndex == "number" && typeof foundIndex2 == "number")
        break;
    }

    let el = this.updateEvents(foundIndex, foundIndex2, event, data);

    this.tags[foundIndex].subTags[foundIndex2] = {...el};
    this.tagBeingEdited = this.tags[foundIndex].subTags[foundIndex2];
    this.cdr.detectChanges();
  }

  async onFileUpload(event: any) {
    let foundTag2: any = "";
    if (this.fileType == null || this.fileType == 'Image') {
      const imageBlob = this.dataURItoBlob(event.croppedImage);
      const imageFile = new File([imageBlob], 'emailImage', { type: 'image/jpeg' });
      if (this.addNewImage == false) {
        let data: any = await this.fileUploadService.uploadOutcomeImageToAmazonServer(imageFile)
        if (this.tagBeingEdited.tag == 'logo') {
          this.logoTag.src = data.message;
        } else if (this.tagBeingEdited.tag == 'image' && !this.tagBeingEdited.subTag) {
          // this.setCropperImage(data.message);
          // this.tags[this.tagBeingEdited.index].src = data.message;
          // this.tags[this.tagBeingEdited.index].default = 'updated';
          // this.tags[this.tagBeingEdited.index].event = event.event;
          this.tagBeingEdited.src = data.message;
          this.tagBeingEdited.defaultImage = false;
          this.tagBeingEdited.event = event.event;
          this.cdr.detectChanges();
        } else if (this.tagBeingEdited.subTag == true) {
          // this.setCropperImage(data.message);
          this.updateColumnModuleWithEvents(event, data);
          // this.tags[foundTag2[0].index] = foundTag2[0];
          // this.cdr.detectChanges();
        }

        foundTag2 = "";
      } else {
        let data: any = await this.fileUploadService.uploadOutcomeImageToAmazonServer(imageFile)
        this.croppedImage = data.message;
        this.addNewImage == true;
        document.getElementById('selectImageModal').style.display = 'none'
        if (this.isBackgroundPattern == false) {
          this.setActiveSB('AddImage');
        } else {
          var index = this.backgroundPattern.length;
          var saveBackgroundImage: any = await this.service.saveNewBackgroundImage(data.message);
          if (saveBackgroundImage.status == "SUCCESS") {
            this.backgroundPattern.unshift(saveBackgroundImage.data);
            setTimeout(() => {
              this.changeBackGroundImage(saveBackgroundImage.data);
            }, 200)
            // document.getElementById("emailTemplateWindow").style.backgroundImage = 'url("' + data.data.imagePath + '")';
            // document.getElementById("emailTemplateWindow").style.backgroundSize = '50%';
            // this.emailBackgroundColor="#E3E3E3";
            // document.getElementById("emailTemplateWindow").style.backgroundColor = this.emailBackgroundColor;

          }
        }
      }
    } else {
      document.getElementById('selectFile').style.display = 'none';
      document.getElementById('changeFile').style.display = 'block';
      //this.pdfSrc = URL.createObjectURL(event.file);
      var file: any = event.file;
      let data: any = await this.fileUploadService.uploadOutcomeImageToAmazonServer(file)
      this.tagBeingEdited.buttonFile =  data.message;
      if (file.type == 'application/x-zip-compressed') {
        $('#fileTypeImage').attr('src', 'assets/icons/ic_zip.svg')
        this.pdfSrc = file.name;
      } else if (file.type == 'application/pdf') {
        $('#fileTypeImage').attr('src', 'assets/icons/ic_pdf.svg')
        this.pdfSrc = file.name;
      } else if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type == 'application/msword') {
        $('#fileTypeImage').attr('src', 'assets/icons/ic_doc.svg')
        this.pdfSrc = file.name;
      } else {
        $('#fileTypeImage').attr('src', 'assets/icons/ic_csv.svg')
        this.pdfSrc = file.name;
      }
    }
  }
  changeFile() {
    document.getElementById('selectFile').style.display = 'block';
    document.getElementById('changeFile').style.display = 'none';
    this.pdfSrc = null;
  }
  logoTag: any = {};

  columnCount: any = 0;

  columnTags :any = [];
  emailCampaignData: any = {
    emailCampaignDtl: []
  };
  emailTemplate: any = {
    emailBodyDtl: []
  };
  subject;
  emailTitle=" ";
  emailThemes=[];
  emailTemplateName:any={};
  dividerLine:any =[];
  async ngOnInit() {
   
    this.columnTags = await this.emailCommonService.getColumnData();
    this.dividerLine = await this.emailCommonService.getDividerLines();
    // var count =1;
    // this.dividerLine.forEach(e =>{
    //   e.image="assets/icons/divider_images/spc"+count+".svg";
    //   count++;
    // })
    if(localStorage.getItem("templateData")){
      this.emailTemplateName = JSON.parse(localStorage.getItem("templateData"));
    }
    this.getTempelatData();
    this.getDefaultBackgroundImages();
    this.getEmailThemes();
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];

    let changedProp: any;

    for (let propName in changes) {

      changedProp = changes[propName];
     
      if(changedProp.currentValue == 'Preview'){
        this.preview();
      }
    }
  }
  async getDefaultBackgroundImages() {
    var data: any = await this.service.getDefaultBackgroundImages();
    if (data.status == 'SUCCESS') {
      this.backgroundPattern = data.data;
      
    } else {
      this.commonService.serverError(data);
    }
  }
  defaultTheme : any = {};
  async getEmailThemes() {
    var emailThemeString = await this.emailCommonService.getEmailThemes();
    this.emailThemes = JSON.parse(emailThemeString);
    var count = -1;  
    // this.emailThemes.forEach( e=>{
    //   console.log(e.themeName)
    //   if(e.themeName == 'Default'){
    //     this.defaultTheme = e;
    //   }
    //   count ++;
    // })
    console.log(this.emailThemes);
    for(var i = 0;i< this.emailThemes.length; i++ ){
      if(this.emailThemes[i].themeName == 'Default'){
        this.defaultTheme = this.emailThemes[i];
        count = i;
      }
    }
    if(count > -1){
      this.emailThemes.splice(count,1);
    }
  }

  async getTempelatData() {
    var emailCampaignData:any = await this.emailCommonService.getEmailCampaign();
    
    if(emailCampaignData.emailCampaign){
      this.emailCampaignData = emailCampaignData.emailCampaign;
    }else{
      this.emailCampaignData = emailCampaignData;
    }
    console.log(this.emailCampaignData);
    if(this.emailCampaignData.emailCampaignType.id == 1){
      $('#main #emailTemplateWindow').css("max-height","95vh"); 
      
    }
    
    this.emailTemplate = await this.emailCommonService.getEmailTemplate();
    if(this.emailTemplate.emailTemplate){
      this.emailTemplateName = this.emailTemplate.emailTemplate;
      $('#main .main-content').addClass(this.emailTemplate.emailTemplate.templateName);
    }
    if(this.emailTemplate.emailSubject != null){
      this.subject = this.emailTemplate.emailSubject;
    }else{
      this.subject = "Add a subject";
    }
    this.tagsRef = this.emailTemplate.emailBodyDtl ? this.emailTemplate.emailBodyDtl : this.emailTemplate;
    if(this.emailTemplate.emailTitle == null || this.emailTemplate.emailTitle == ''){
      this.emailTemplate.emailTitle = 'Email Template Title';
    }
    console.log(this.emailTemplate);
    this.emailTitle = this.emailTemplate.emailTitle
    this.tagsRef = this.tagsRef.filter(value => value.tag != null);
    
    if (this.tagsRef == undefined) { this.tagsRef = []; };
    if (this.tagsRef.length == 0) {
      //await this.themeTemplateInitialization();
      await this.newTemplateInitialization();
    } else {
      //var container = $("#emailTemplateWindow");
      
      this.defaultTempelate = await this.emailCommonService.getDefaultTemplate(this.emailTemplateName.id);
      this.tags = [...this.tagsRef];
      this.tags.forEach(tag => {
        if (tag.tag == 'logo') { this.hasLogo = true; }
        if (tag.tag == 'title') { this.titleCount++; }
        if (tag.tag == 'text') { this.textBoxCount++ }
        if (tag.tag == 'image') { this.imageCount++; }
        if (tag.tag == 'button') { this.buttonCount++; }
        if (tag.tag == 'divider') { this.dividerCount++ }
        if (tag.tag == 'column') { 
          this.columnCount++;
          if (tag.subTags != null) {
            tag.subTags.forEach((item) => {
              item.tagId = 'column' + this.columnCount;
              this.columnCount++;
            });
          }
        }
      });
    }
    for (var i = 0; i < this.tagsRef.length; i++) {
      if (this.tagsRef[i].tag == 'logo') {
        this.logoTag = this.tagsRef[i];
        var obj = this.tags.findIndex(e => e.tagId == this.logoTag.tagId)
        this.tags.splice(obj, 1);
      } if (this.tagsRef[i].tag == 'title') {
        this.headerTag = this.tagsRef[i];
        var obj = this.tags.findIndex(e => e.tagId == this.headerTag.tagId)
        this.tags.splice(obj, 1);
      } if (this.tagsRef[i].tag == 'footer') {
        this.footerTag = this.tagsRef[i];
        if(this.emailCampaignData.postalAddress != null || this.emailCampaignData.postalAddress != " "){
          this.footerTag.address = this.emailCampaignData.postalAddress;
        }
        var obj = this.tags.findIndex(e => e.tagId == this.footerTag.tagId)
        this.tags.splice(obj, 1);
      }
    }
    var count = 0;
    this.tags.forEach(tag => {
      tag.index = count;
      count++;
    })
   
    //this.cdr.detectChanges();
    setTimeout(() => {
      this.checkForButtonUrl();
      //this.svgUrlToPng('jdfh');
      if(this.emailTemplate.emailTheme){
        if(this.emailTemplate.emailTheme.className){ 
          this.activelable(this.emailTemplate.emailTheme.className)  
        }else{
          this.activelable(this.emailTemplate.emailTheme.themeName)  
        }
      }
      this.callApplyCss();
    }, 200);
  }

  removeSortableHeader() {
    setTimeout(() => {
      // remove sortable button provided with library ngx sortable
      if (document.getElementsByClassName('sortable-header') && document.getElementsByClassName('sortable-header')[0]) {
        document.getElementsByClassName('sortable-header')[0].remove();
      }

      this.cdr.detectChanges();
    }, 0);
  }

  async newTemplateInitialization(fromScratch?: any) {
    var data: any = await this.emailCommonService.getDefaultThemeTempelate(this.emailTemplateName);
      this.emailCommonService.setDefaultTempelate(data);
      
        if (fromScratch) {
          this.removeSortableHeader();
        }
        this.defaultTempelate = Object.assign([], data);
        this.tagsRef = Object.assign([], data);
        // debugger;
        this.tags = [...data];
        this.tags.forEach(tag => {
          delete tag.id;
          if(tag.createdon) delete tag.createdon;
          if(tag.lastUpdate) delete tag.lastUpdate;
          if (tag.tag == 'logo') { tag.tagId = 'logo'; tag.src = 'assets/images/dummy_logo.png'; this.hasLogo = true; tag.style = {} }
          if (tag.tag == 'title') { tag.tagId = 'title' + this.titleCount; this.titleCount++; }
          if (tag.tag == 'text') { tag.tagId = 'textBox' + this.textBoxCount; this.textBoxCount++ }
          if (tag.tag == 'image') { tag.tagId = 'image' + this.imageCount; this.imageCount++; tag.style = {} }
          if (tag.tag == 'button') { tag.tagId = 'button' + this.buttonCount; this.buttonCount++; tag.style = {} }
          if (tag.tag == 'divider') { tag.tagId = 'divider' + this.dividerCount; this.dividerCount++ }
          if (tag.tag == 'column') { 
            delete tag.subTagIds;
            tag.tagId = 'column' + this.columnCount; 
            this.columnCount++;
            if (tag.subTags != null) {
              tag.subTags.forEach(item => {
                delete item.id;
                if(item.createdon){ delete item.createdon; } 
                if(item.lastUpdate ){ delete item.lastUpdate ; }  
                item.tagId = 'column' + this.columnCount;
                this.columnCount++;
              });
            }
          }
        });

        setTimeout(() => {
          if(this.emailTemplateName.id){
            console.log("Adding Default Theme");
            $('#main .main-content').addClass(this.emailTemplateName.templateName);
            if(this.emailTemplateName.templateName == 'template2' || this.emailTemplateName.templateName == 'template4' || this.emailTemplateName.templateName == 'template5'){
              $("#pinterestIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845904953-pinterestShareIcon")
              $("#facebookIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845662216-facebookshareIcon")
              $("#twitterIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845769334-twittershareIcon")
            $("#main .main-content .content .last span a").css("color", "white");
            }
          }
          this.tags.forEach(async tag => {
            if (tag.style != null) {
              console.log("Applying Css for :"+ tag.tagId)
              await this.applyCss(tag);
            }
            if(tag.tag == "column"){
              if(tag.subTags.length > 0){
                tag.subTags.forEach(async e =>{
                  console.log("Applying Css for :"+ e.tagId)
                  await this.applyCss(e);
                })
              }
            }
          })
        },200)
        

        setTimeout(() => {
          this.saveEmailCampaing();
        }, 300);
  }

  checkForButtonUrl(){
    this.tags.forEach(element =>{
      if(element.tag == "button"){
          var url = null;
        if(element.buttonLink == "URL" && element.buttonUrl != null){
          url = element.buttonUrl
         
        }else if(element.buttonLink == "FILE" && element.buttonFile != null){
          url = element.buttonFile
        }
        if(url != null){
          var a = document.createElement('a');
          a.href =this.common.baseurl+"/emailCampaign/email/click?trackToken=<<trackToken>>&url="+ url;
          a.target = "_blank";
          $('#button' + element.tagId).wrap(a);
        }
      }
    })
  }
   callApplyCss(){
    $(".sortable-container").css('border', 'none');
    this.applyCss(this.logoTag);
    this.applyCss(this.emailTemplate);
    var dynamicValues : any = document.getElementsByClassName("dynamicValue");
    for(var i=0 ;i< dynamicValues.length; i++ ){
      dynamicValues[i].setAttribute("style", "cursor: pointer;");
    }
    // dynamicValues.forEach(e => {
    //     e.setAttribute("style", "cursor: pointer;");
    // });
    // window.scroll(0,0);
    this.tags.forEach(tag => {
      if (tag.style != null) {
        this.applyCss(tag);
      }
      if(tag.tag == "column"){
        if(tag.subTags.length > 0){
          tag.subTags.forEach( e =>{
               this.applyCss(e);
          })
        }
      }
    })
  }
  async applyCss(tag) : Promise<void> {
    if (tag.style != null) {
      if (tag.tag == "logo" || tag.tag == "image") {
        if (tag.style.width)
          document.getElementById("image" + tag.tagId).style.width = tag.style.width;
        if (tag.style.margin)
          document.getElementById("image" + tag.tagId).style.margin = tag.style.margin;
         if(tag.tag == 'logo'){ this.selectAlignmentOptionForButtonAndImage(tag); }
      } else if (tag.tag == "button") {
        if (tag.style.fontFamily)
          document.getElementById("button" + tag.tagId).style.fontFamily = tag.style.fontFamily;
        if (tag.style.textAlign)
          document.getElementById("buttonDiv" + tag.tagId).style.textAlign = tag.style.textAlign;
        if (tag.style.color)
          document.getElementById("button" + tag.tagId).style.color = tag.style.color;
        if (tag.style.backgroundColor)
          document.getElementById("ActionButton" + tag.tagId).style.backgroundColor = tag.style.backgroundColor;
        if (tag.style.borderColor)
          document.getElementById("ActionButton" + tag.tagId).style.borderColor = tag.style.borderColor;
        if (tag.style.borderWidth)
          document.getElementById("ActionButton" + tag.tagId).style.borderWidth = tag.style.borderWidth;
      }else if(tag.tag == "text"){
        if (tag.style.marginTop)
          document.getElementById("text" + tag.tagId).style.marginTop = tag.style.marginTop;
        if (tag.style.color)
          document.getElementById("text" + tag.tagId).style.color = tag.style.color;
        if (tag.style.fontWeight)
          document.getElementById("text" + tag.tagId).style.fontWeight = tag.style.fontWeight;
        if (tag.style.fontSize)
          document.getElementById("text" + tag.tagId).style.fontSize = tag.style.fontSize;
          

      }else if(tag.tag == "divider"){
        if(tag.src != null){
          $("#divider"+tag.tagId).css('border-top', 'none');
          var svgImg = $("#divider"+tag.tagId+" .my-icon")
          var dividerImg = svgImg[0];
            var x = $(dividerImg).children()[0]
            if(x != undefined){
              x.setAttribute( 'style', 'stroke: '+tag.style.stroke+' '  );
            }else{
              setTimeout(()=>{
                this.applyCss(tag);
              },200);
            }
        }else{
          $("#divider"+tag.tagId).css(tag.style);
        }    
      }
    }
    if (tag.innerBackground) {
      if (tag.innerBackground.innerBackColor) {
        document.getElementById("emailTemplateInnerWindow").style.backgroundColor = tag.innerBackground.innerBackColor;
      }
      if (tag.innerBackground.borderColor) {
        document.getElementById("emailTemplateInnerWindow").style.border = 1 + "px" + " solid " + tag.innerBackground.borderColor;
      }
      if (tag.innerBackground.borderWidth) {
        document.getElementById("emailTemplateInnerWindow").style.borderWidth = tag.innerBackground.borderWidth + "px"
      }
      if (tag.innerBackground.showBackgroundColor == false) {
        document.getElementById("emailTemplateInnerWindow").style.backgroundColor = 'transparent';
      }
    }
    if (tag.mainBackground) {
      if (tag.mainBackground.backgroundColor) {
        document.getElementById("emailTemplateWindow").style.backgroundColor = tag.mainBackground.backgroundColor;
      }
      if (tag.mainBackground.emailBackImage != null) {
        if(tag.mainBackground.emailBackImage.id){
          document.getElementById("emailTemplateWindow").style.backgroundImage = 'url("' + tag.mainBackground.emailBackImage.imagePath + '")';
          document.getElementById("emailTemplateWindow").style.backgroundSize = '50%';
        }
      }
      if (tag.mainBackground.imageBackColor != null) {
        document.getElementById("emailTemplateWindow").style.backgroundColor = tag.mainBackground.imageBackColor;
      }
    }
  }
  ngAfterViewInit() {

    this.removeSortableHeader();    
  }
  backgroundSelected;
  changeBackGroundImage(image) {
    if(!this.emailTemplate.mainBackground.emailBackImage || this.emailTemplate.mainBackground.emailBackImage == null){
      this.emailTemplate.mainBackground.emailBackImage = {};
    }
    if ($('.bckroundImg') && $('.bckroundImg').hasClass('active')) {
      $('.bckroundImg').removeClass('active');
    }
    if ($('#backgroundImage' + image.id).hasClass('active') == false) {
      $('#backgroundImage' + image.id).addClass('active');
      this.emailTemplate.mainBackground.emailBackImage.id = image.id;
      this.emailTemplate.mainBackground.backgroundColor = "#E3E3E3";
      document.getElementById("emailTemplateWindow").style.backgroundImage = 'url("' + image.imagePath + '")';
      document.getElementById("emailTemplateWindow").style.backgroundSize = '50%';
      this.emailBackgroundColor = "#E3E3E3";
      document.getElementById("emailTemplateWindow").style.backgroundColor = this.emailBackgroundColor;
      setTimeout(()=>{
        this.backgroundSelected = image.id;
      },200)
    }

  }
  activelable(classname, themeId ?: any) {
      $('#main .main-content').removeClass('template1 template2 template3 template4 template5');
      $("#main .main-content").removeClass('classic minimal rose write funny paper purple nature forest classic2');
      if(classname != 'Default'){
        $('#main .main-content').addClass(classname);
      }else{
        this.addDefaultTheme();
      }
     // $('.last   .sharelast.d-inline').removeClass('d-inline');
      
      // if ($('.last .sharelast').hasClass('d-none') == false) {

      //  $('.last .sharelast').addClass('d-none');
      // // }
      // $('.last  .sharelast.d-none.share'+classname).removeClass('d-none');

      // $('.last  .sharelast.share'+classname).addClass('d-inline');

      // if ($('.alboum12 label.active') && $('.alboum12 label.active').hasClass('active')) {
      //   $('.alboum12 label.active').removeClass('active');
      // }

    // if ($('.' + classname).hasClass('active') == false) {
    //   $('.' + classname).addClass('active');
    // }
    if(this.emailTemplateName && classname != 'Default'){
      if(this.emailTemplateName.templateName == 'template2' || this.emailTemplateName.templateName == 'template4' || this.emailTemplateName.templateName == 'template5'){
        $("#pinterestIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845904953-pinterestShareIcon")
        $("#facebookIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845662216-facebookshareIcon")
        $("#twitterIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845769334-twittershareIcon")
      }
    }
    if(themeId){
      this.emailTemplate.emailTheme.id = themeId;
      this.saveEmailTheme(themeId);
    }
  }
  addDefaultTheme(){
    $("#main .main-content").removeClass('classic minimal rose write funny paper purple nature forest classic2');
    $('#main .main-content').addClass(this.emailTemplateName.templateName);
    if(this.emailTemplateName.templateName == 'template2' || this.emailTemplateName.templateName == 'template4' || this.emailTemplateName.templateName == 'template5'){
        $("#pinterestIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845474895-pinInterestshareIconWt")
        $("#facebookIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845129923-shareIconWt")
        $("#twitterIcon").attr("src","https://zuuba.s3.amazonaws.com/1586845323554-twittershareIconWt")
        $("#main .main-content .content .last span a").css("color", "white");
    }
  }
  content(activeTab) {
    this.activeTab = activeTab;
    if ($('#swapp li.active') && $('#swapp li.active').hasClass('active')) {
      $('#swapp li.active').removeClass('active');
    }
    $('#content').addClass('active');

  }

  design(activeTab) {
    this.activeTab = activeTab;
    if ($('#swapp li.active') && $('#swapp li.active').hasClass('active')) {
      $('#swapp li.active').removeClass('active');
    }
    $('#design').addClass('active');
  }
  activeradiobtn(activeradio) {
    this.activeradio = activeradio;
    $('#radio-' + activeradio).prop('checked', true);
    if (activeradio == '1b') {
      this.tagBeingEdited.buttonLink = 'URL'
      this.tagBeingEdited.buttonFile = null;
    }
    else {
      this.tagBeingEdited.buttonLink = 'FILE'
      this.tagBeingEdited.buttonUrl = null;
    }
  }
  mainbackground(activeTab) {
    this.activeTab = activeTab;
    if ($('#swapp li.active') && $('#swapp li.active').hasClass('active')) {
      $('#swapp li.active').removeClass('active');
    }
    $('#main_background').addClass('active');
    //this.saveBackgrounds();
  }
  innerbackground(activeTab) {
    this.activeTab = activeTab;
    if ($('#swapp li.active') && $('#swapp li.active').hasClass('active')) {
      $('#swapp li.active').removeClass('active');
    }
    $('#inner_background').addClass('active');
    //this.saveBackgrounds();
  }
  lastAddedColumnIndex: any = 0;
  columnAdded: any = false;
  oldSubTagsBeingEdited:any =[];
  columnTagCopy:any = [];
  oldColumnTagType :any ={};
  async setActiveSB(sbName) {
    // debugger;
     if(this.activeSB == 'background'){
       this.saveBackgrounds();
     }
    if (typeof sbName != 'number') {
      this.activeSB = sbName;
    }
    this.linkTo = ' ';
    
    if (!this.tagBeingEdited.id && sbName != 'background' && sbName != 'themes' && sbName != null) {
      this.addLinkToImage = false;
      $("#emailTemplateWindow").scrollTop(0);
      // aadd columnTags for finding tag and updating tagBeingEdited
      this.defaultTempelate = this.defaultTempelate.concat(this.columnTags);
      this.defaultTempelate.forEach(async tag => {
        if (this.activeSB == 'AddText' && tag.tag == 'text' && !this.tagBeingEdited.subTag) {
          // debugger;
          this.tagBeingEdited = {
            tag: tag.tag,
            style: tag.style,
            text: "Add your text here. Edit to add dynamic values like name, email and more.",
            tagId: 'textBox' + this.textBoxCount,
            compOrder: 1
          };
          this.textBoxCount++;
          // this.item.index='textBox'+textId.length+1;
        } else if (this.activeSB == 'AddButton' && tag.tag == 'button' && !this.tagBeingEdited.subTag) {
           
          this.tagBeingEdited = {
            tag: tag.tag,
            style: tag.style,
            text: tag.text,
            tagId: 'button' + this.buttonCount,
            compOrder: 1
          };
          this.buttonCount++;
        } else if (this.activeSB == 'AddImage' && tag.tag == 'image' && !this.tagBeingEdited.subTag) {
          this.tagBeingEdited = {
            tag: tag.tag,
            tagId: 'image' + this.imageCount,
            src: this.croppedImage,
            altText: 'Image text',
            compOrder: 1
          };
          this.imageCount++;
        } else if (this.activeSB == 'AddSpacer' && tag.tag == 'divider' && !this.tagBeingEdited.subTag) {

          this.tagBeingEdited = {
            tag: tag.tag,
            style: tag.style,
            text: tag.text,
            tagId: 'divider' + this.dividerCount,
            compOrder: 1,
          };
          this.tagBeingEdited.style = {};
          await this.setActiveSpacer(1);
          this.dividerCount++;
        } else if (this.activeSB == 'AddColumn' && tag.tagType == sbName) {
          this.tagBeingEdited =  Object.assign({},tag);
          this.tagBeingEdited.tagId = 'column' + this.columnCount; 
          this.columnCount++;
          this.tagBeingEdited.subTags.forEach((item) => {
            item.tagId = 'column' + this.columnCount;
            this.columnCount++;
          });
          this.tagBeingEdited.compOrder = 1
        }
      });

      this.defaultTempelate.splice(this.defaultTempelate.length - 8, 7);
      //  && !this.tagBeingEdited.subTag add this condition in below if condition if something goes wrong
      if (this.activeSB != 'AddLogo' && !this.tagBeingEdited.subTag) {
        //this.tags.splice(0, 0, this.tagBeingEdited)
        if (this.tagBeingEdited.subTags && this.tagBeingEdited.subTags.length !== -1) {
          if (!this.columnAdded) {
            this.tags.splice(0, 0, this.tagBeingEdited);
            this.columnAdded = true;
            this.lastAddedColumnIndex = 0;
          } else {
            this.tags.splice(this.lastAddedColumnIndex, 1, this.tagBeingEdited);
          }
        } else {
          this.tags.splice(0, 0, this.tagBeingEdited);
        }
        var count = 0;
        this.tags.forEach(tag => {
          tag.index = count;
          count++;
        })
      }else if(this.activeSB == 'AddLogo'){
        this.tagBeingEdited = {
          tag: 'logo',
          tagId: 'logo1',
          altText: 'Logo text',
          style: {margin: "0px auto", aligment: "Center", width: "50%"},
          src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/dummy_logo.png',
          compOrder: 0
        };
        this.hasLogo = true;
        this.logoTag = this.tagBeingEdited;
      }
      
    //To save the newly created component
    // && !this.tagBeingEdited.subTags add this condition in the below if condition if something goes wrong
    if(this.tagBeingEdited.tagId && !this.tagBeingEdited.subTags){
      setTimeout(()=>{
        this.savePreviouslyFocusedElement('AddingNewElement');
        if (this.tagBeingEdited.tag == "text")
        this.editFocus(this.tagBeingEdited.tag, this.tagBeingEdited);
      },200);
    }
      this.cdr.detectChanges();
    }else if(sbName == null){
      this.activeSB = "";
      $("#addTabImage").attr('src','assets/icons/ic_addelements_on.svg');
      $("#themesTabImage").attr('src','assets/icons/ic_themes_off.svg');
      $("#backgroundTabImage").attr('src','assets/icons/ic_background_off.svg');
    }else if(sbName == 'background'){
      $("#addTabImage").attr('src','assets/icons/ic_addelements_off.svg');
      $("#themesTabImage").attr('src','assets/icons/ic_themes_off.svg');
      $("#backgroundTabImage").attr('src','assets/icons/ic_background_on.svg');
      setTimeout(()=>{
          $('#main .sidepar .scroll').css({"height":"100%", "padding-bottom":"15%"});
      },200)
      var selectedBackgroundImage :any = this.emailTemplate.mainBackground;

      if(selectedBackgroundImage.id){
          if(selectedBackgroundImage.emailBackImage.id){
            setTimeout(()=>{
              $('#backgroundImage' + selectedBackgroundImage.emailBackImage.id).addClass('active');

            },100)
          }
      }
    }else if(sbName == 'themes'){
      $("#addTabImage").attr('src','assets/icons/ic_addelements_off.svg');
      $("#themesTabImage").attr('src','assets/icons/ic_themes_on.svg');
      $("#backgroundTabImage").attr('src','assets/icons/ic_background_off.svg');
      // if(this.emailCampaignData.emailCampaignType.id == 1){
      //   setTimeout(()=>{
      //     $('#main .sidepar .emailbuilderSidebar').css("height", "80vh");
      //   },200)
      // }
      
      
    }else if(this.tagBeingEdited.tag == 'column' && this.tagBeingEdited.id){
      var columnData = await this.emailCommonService.replsceColumNData();
      this.columnTagCopy =  JSON.parse(columnData);
      this.setActiveColumn(this.tagBeingEdited.tagType)
      this.columnTagCopy .forEach(tag=>{
           if(sbName == tag.tagType && this.tagBeingEdited.tagType != tag.tagType){
                if(this.oldSubTagsBeingEdited.length == 0){
                  this.oldSubTagsBeingEdited = Object.assign([], this.tagBeingEdited.subTags);
                }
                
                this.tagBeingEdited.subTags = Object.assign([],tag.subTags);
                this.tagBeingEdited.tagType = tag.tagType;
                this.tagBeingEdited.subTagIds = null;
                this.tagBeingEdited.changeColView = true;
                this.columnCount++;
                this.tagBeingEdited.subTags.forEach(subT=>{
                  subT.tagId = 'column' + this.columnCount;
                  this.columnCount++;
                  this.oldSubTagsBeingEdited.forEach(oldSubTag=>{
                     if(subT.tag === oldSubTag.tag){
                       subT.text = oldSubTag.text;
                       subT.altText = oldSubTag.altText;
                       subT.style = oldSubTag.style;
                       subT.src = oldSubTag.src;
                       subT.buttonFile = oldSubTag.buttonFile;
                       subT.buttonLink = oldSubTag.buttonLink;
                       subT.buttonUrl = oldSubTag.buttonUrl;
                     }
                  })      
                })
           }
      })
    }else if(sbName == 'AddSpacer' && this.tagBeingEdited.spacerId != null){
        setTimeout(()=>{
          this.setActiveSpacer(this.tagBeingEdited.spacerId);
          // if(this.emailCampaignData.emailCampaignType.id == 1){
          //   $('#main .sidepar .scroll').css("height","340px !important");
          // }
         },200)
    }

  }

  selectedElTagId: any;
  onColumnInputText(event, item) {
    event.stopPropagation();
    if(item.subTag == true){
      if(item.id){
        this.onEditorItemClick(item);
        // this.onInputText(item, true);
        this.tagBeingEdited = {};
        this.tagBeingEdited = item;
        this.openActiveTab();
        this.selectedElTagId = item.tagId;
      }else{
        this.onEditorItemClick(item);
      }
    }else{
      this.onEditorItemClick(item);
      // this.onInputText(item, true);
      this.tagBeingEdited = {};
      this.tagBeingEdited = item;
      this.openActiveTab();
      this.selectedElTagId = item.tagId;
    }
    
  }

  async onCancelElEffects() {
     // debugger
    if(this.tagBeingEdited.tag == 'column'){
      if(this.oldSubTagsBeingEdited.length > 0){
        this.tagBeingEdited.changeColView = false;
        this.tagBeingEdited.subTags = this.oldSubTagsBeingEdited;
      }
      this.tagBeingEdited.tagType = this.oldColumnTagType.tagType;
      this.tagBeingEdited.subTagIds = this.oldColumnTagType.subTagIds;
      if(!this.tagBeingEdited.id){
        this.tagBeingEdited = {};
      }
      var index = this.tags.findIndex(e=> !e.id);
      console.log(index)
      if(index >= 0){
        this.tags.splice(index,1);
      }
      console.log(this.tags);
    }else{
      console.log("Old Tag Data; ",this.oldTagBeingEdited);
      console.log("Old Tag Data; ",JSON.parse(this.oldTagBeingEdited));
      console.log("New Tag Being edited; ",this.tagBeingEdited);
      this.oldTagBeingEdited = JSON.parse(this.oldTagBeingEdited);
      if(this.tagBeingEdited.tag == "text"){
           $("#text"+this.tagBeingEdited.tagId).html(this.tagBeingEdited.text);
           var dynamicValuetoDelete = [];
           this.tagBeingEdited.dynamicValues.forEach( value =>{
             var count = 0;
                this.oldTagBeingEdited.dynamicValues.forEach(e=>{
                    if(e.id == value.id){
                        count++;
                    }
                })
                if(count == 0){
                  dynamicValuetoDelete.push(value.id);
                }
           })
           if(dynamicValuetoDelete.length > 0){
               var data : any = await this.service.deleteDynamicValue(dynamicValuetoDelete.join());
              console.log(data);
                if(data.status == "SUCCESS"){
                  this.emailCommonService.updateEmailTempelateDynamicVale(this.tagBeingEdited,dynamicValuetoDelete);
                }
           }
        // if(this.oldTagBeingEdited.dynamicValues.length == 0 && this.tagBeingEdited.dynamicValues.length > 0){
        //       this.tagBeingEdited.dynamicValues.forEach
        // }
        // if(this.oldTagBeingEdited.length != this.tagBeingEdited.length){

        // }
        // var data : any = await this.service.deleteDynamicValue(result[1]);
        // console.log(data);
        //   if(data.status == "SUCCESS"){
        //      this.emailCommonService.updateEmailTempelateDynamicVale(this.tagBeingEdited,result[1]);
             
        //   }
      }
      
    }
    this.toggleToSBList();
  }
  resetFontAndColorVariables(){
    this.columnBeingEdited = 0;
    this.selectedFont = 'Select';
    this.borderWidth = 0;  
    this.borderColor = '#000000';
    this.buttonColor ='#1DCB9A';
    this.buttonTextColor = '#ffff';
    this.verticalSpacing = 0;
    this.imageWidth = 100;
    this.linkTo = ' ';
    this.addLinkToImage = false;
    this.oldSubTagsBeingEdited = [];
    this.selectedSpacerLine ={};
    this.showDeleteButton = "";
    this.activeColumn = 0;
  }
  toggleToSBList() {
    this.activeSB = ''
    this.resetFontAndColorVariables();
    $("#addTabImage").attr('src','assets/icons/ic_addelements_on.svg');
    $("#themesTabImage").attr('src','assets/icons/ic_themes_off.svg');
    $("#backgroundTabImage").attr('src','assets/icons/ic_background_off.svg');
    if (this.tagBeingEdited.id) {
      if (this.tagBeingEdited.tag == 'button') {
        if (this.tagBeingEdited.buttonLink == 'URL')
          this.tagBeingEdited.buttonFile = null
        else if (this.tagBeingEdited.buttonLink == 'FILE')
          this.tagBeingEdited.buttonUrl = null
      }
      if (this.tagBeingEdited.tag != 'footer' && this.tagBeingEdited.tag != 'logo' && this.tagBeingEdited.tagId != 'title1' && !this.tagBeingEdited.subTag)
        this.tags[this.tagBeingEdited.index] = this.tagBeingEdited;
      if (this.tagBeingEdited.tag == 'footer') {
        if (this.showAddress == false)
          this.footerTag.address = null;
        if (this.showPhoneNumber == false)
          this.footerTag.phoneNumber = null
        if (this.showShareVia == false) {
          this.footerTag.shareViaFacebook = null
          this.footerTag.shareViaPinterest = null
          this.footerTag.shareViaTwitter = null
        }
        if (this.showAddUrl == false) {
          this.footerTag.linkTitle = null;
          this.footerTag.linkUrl = null;
        }
        if (this.showPinterest == false) {
          this.footerTag.shareViaPinterest = null
        }
        if (this.showFacebook == false) {
          this.footerTag.shareViaFacebook = null
        }
        if (this.tagBeingEdited.tag != 'footer' && this.tagBeingEdited.tag != 'logo' && this.tagBeingEdited.tagId != 'title1')
          this.tags[this.tagBeingEdited.index] = this.tagBeingEdited;

        if (this.tagBeingEdited.tag == 'footer') {
          if (this.showAddress == false)
            this.footerTag.address = null;
          if (this.showPhoneNumber == false)
            this.footerTag.phoneNumber = null
          if (this.showShareVia == false) {
            this.footerTag.shareViaFacebook = null
            this.footerTag.shareViaPinterest = null
            this.footerTag.shareViaTwitter = null
          }
          if (this.showAddUrl == false) {
            this.footerTag.linkTitle = null;
            this.footerTag.linkUrl = null;
          }
          if (this.showPinterest == false) {
            this.footerTag.shareViaPinterest = null
          }
          if (this.showFacebook == false) {
            this.footerTag.shareViaFacebook = null
          }
          if (this.showTwitter == false) {
            this.footerTag.shareViaTwitter = null
          }
        }
      }
      this.tagBeingEdited = { style: {} };
    }
  }
  onInputText(event, fromColumn) {
    if (this.tagBeingEdited.tagId != event.tagId) {
      if (this.tagBeingEdited.tagId && this.tagBeingEdited.tagId != event.tagId && !event.subTag) {
        this.savePreviouslyFocusedElement();
      }
      var count = 0;
      this.tags.forEach(element => {
        if (element.id == event.id && !event.subTag) {
          if (element.tag == 'button') {
            if (element.buttonLink == null)
              element.buttonLink = 'URL'
              this.selectAlignmentOptionForButtonAndImage(element);
          }else if(element.tag == "image" || element.tag == "logo"){
            if(element.linkUrl != null && element.linkUrl != ""){
              this.addLinkToImage = true;
               setTimeout(()=>{
                $("#showLinkOnOffswitch").trigger("click");
               },200) 
            }else{
              if(this.addLinkToImage == true){  this.addLinkToImage = false; }
            }
           this.selectAlignmentOptionForButtonAndImage(element);
          }else if(element.tag == "column"){
            this.oldColumnTagType = Object.assign({},element);
            event.subTags.forEach( e =>{
                delete e.createdon;
                delete e.lastUpdate;
            })
          }
          this.tagBeingEdited = event;
          this.tagBeingEdited.index = count;
          this.oldTagBeingEdited = JSON.stringify(event);
          console.log(this.oldTagBeingEdited);
          this.openActiveTab()
        }
        else {
          count++;
        }

      });
      if (event.tag == 'footer') {
        this.tagBeingEdited = event;
        this.tagBeingEdited.index = count;
        this.oldTagBeingEdited = JSON.stringify(event);
        this.openActiveTab()
      }

      if (event.tag == 'title') {
        this.tagBeingEdited = event;
        this.oldTagBeingEdited = JSON.stringify(event);
        // this.tagBeingEdited.index = count;
        this.openActiveTab()
      }

      if (event.tag == 'logo') {
        this.tagBeingEdited = event;
        this.oldTagBeingEdited = JSON.stringify(event);
        if(event.linkUrl != null && event.linkUrl != ""){
          this.addLinkToImage = true;
           setTimeout(()=>{
            $("#showLinkOnOffswitch").trigger("click");
           },200) 
        }else{
          if(this.addLinkToImage == true){  this.addLinkToImage = false; }
        }
       this.selectAlignmentOptionForButtonAndImage(event);
        this.openActiveTab()
      }
      if (this.tagBeingEdited.style == null) {
        this.tagBeingEdited.style = {};
      }
    }
  }
  selectAlignmentOptionForButtonAndImage(element){
    console.log(element);
    if(element.style != null){
      if(element.tag == 'image' || element.tag == 'logo'){
        if(element.style.aligment) {
          setTimeout(()=>{
            var list :any  = document.getElementsByClassName('alig-label');
            for (let item of list) {
              if ($(item) && $(item).hasClass('activeImageAlign')) {
                $(item).removeClass('activeImageAlign')
              }
            }
              $("#imageAlign"+element.style.aligment).addClass('activeImageAlign');
          },200) 
        } 
        if(element.style.marginTop){  
          this.verticalSpacing = element.style.marginTop; 
        }
        if(element.style.width){ 
          var width =  element.style.width.split('%');
          this.imageWidth = width[0]; 
        }
      }else{
          setTimeout(()=>{
            var list: any = document.getElementsByClassName('button-alig-label');
            for (let item of list) {
              if ($(item) && $(item).hasClass('activeImageAlign')) {
                $(item).removeClass('activeImageAlign')
              }
            }
            if(element.style.textAlign){
              $("#buttonAlign"+element.style.textAlign).addClass('activeImageAlign');
            }else{
              $("#buttonAlignCenter").addClass('activeImageAlign');
            }
          },200)
          if(element.style.fontFamily){
               this.selectedFont = element.style.fontFamily;
          }if(element.style.borderWidth){
            var width =  element.style.borderWidth.split('p');
            (width)
             this.borderWidth = width[0];  
            }
          if(element.style.borderColor){   this.borderColor = element.style.borderColor}
          if(element.style.backgroundColor){   this.buttonColor = element.style.backgroundColor }
          if(element.style.color){ this.buttonTextColor = element.style.color   }
      }
    }
    if(element.tag == 'button'){
      setTimeout(()=>{
        if(element.buttonLink == "FILE"){ 
          this.activeradiobtn('2b')
          var fileName = element.buttonFile.split('/');
          this.pdfSrc = fileName[fileName.length-1];
        }
        else{ this.activeradiobtn('1b') }
      })
    }
  }
  previouslySelectedTag: any;
  async updateTagBeignEditedHtml(tag) {
    // debugger;
    if (tag.tag == 'logo' || tag.tag == 'image' && !tag.subTag) {
      var data = $('#image' + tag.tagId);

      tag.htmlText = data[0].outerHTML
    } else if (tag.tag == 'title' || tag.tag == 'text' && !tag.subTag) {
      var data = $('#text' + tag.tagId);
      //var dataDiv = $("#textDiv"+tag.tagId);
      var childElements = data[0].childNodes;
      childElements.forEach( e=>{
        if(e.className == 'dynamicValue'){
              e.removeAttribute("style"); 
        }
      })
      data = $('#text' + tag.tagId);
      var dataDiv = $("#textDiv"+tag.tagId);
      tag.text = data[0].innerHTML
      tag.htmlText = dataDiv[0].outerHTML
    } else if (tag.tag == 'button' && !tag.subTag) {
      var data = $('#buttonDiv' + tag.tagId);
      tag.htmlText = data[0].outerHTML
    } else if (tag.tag == 'footer' && !tag.subTag) {
      var data = $('#footer' + tag.tagId);
      tag.htmlText = data[0].outerHTML
    } else if (tag.tag == 'divider' && !tag.subTag) {
      var data = $('#divider' + tag.tagId);
      console.log(data);
      tag.htmlText = data[0].outerHTML
    } else if (tag.tag == 'column') {
      if (tag.subTags != null) {
        var data = $('#column' + tag.tagId);
        tag.htmlText = data[0].outerHTML;
        tag.subTags.forEach(st => {
          let subTagEle: any;
          if(st.tag == "button"){
            subTagEle = document.getElementById("button"+st.tagId);
          }else{
            subTagEle = document.getElementById("column"+st.tagId);
          }
          st.htmlText = subTagEle.outerHTML;
          st.text = subTagEle.innerHTML;
        });
      }
    }
  }
  async savePreviouslyFocusedElement(addintNewElement?: string, onColumnAdded?: any) {
    //await this.updateHtmlText()
    // debugger;
    console.log(this.tagBeingEdited)
    if (!this.tagBeingEdited.subTags && !this.tagBeingEdited.subTag) {
      this.previouslySelectedTag = Object.assign({}, this.tagBeingEdited);
    } else {
    //  if(!this.tagBeingEdited.id){
      if(!this.tagBeingEdited.subTag){
        this.previouslySelectedTag = Object.assign({}, this.tagBeingEdited);
      }else{
        let foundTag: any = this.tags.filter(tag => {
          if (tag.subTags) {
            let foundSubTag = tag.subTags.filter(subTag => {
              // if (typeof subTag.id == "string") {
              //   delete subTag.id;
              // }
              if (subTag.tagId == this.tagBeingEdited.tagId) {
                return subTag;
              };
            });
            if (foundSubTag.length > 0) {
              // if (typeof tag.id == "string") {
              //   delete tag.id;
              // }
              return tag;
            }
          };
        });
      this.previouslySelectedTag = Object.assign({}, foundTag[0]);
       }
      console.log(this.previouslySelectedTag)
    }
    if(this.previouslySelectedTag.tag == 'divider' && this.previouslySelectedTag.src != null){
      console.log("Saving divider image");
      this.saveDividerAsImage();
    }else{
      await this.updateTagBeignEditedHtml(this.previouslySelectedTag);
      var emailTemplate: any = {
        id: this.emailTemplate.id,
        emailBodyDtl: [this.previouslySelectedTag]
      }
      var emailCampaign: any = {
        id: localStorage.getItem("emailCampaignId"),
        emailCampaignDtl: [emailTemplate]
      }
      var data: any = await this.service.createEmailCampaign(emailCampaign);
      if (data.status == 'SUCCESS') {
        this.previouslySelectedTag = {};
        if (addintNewElement == 'AddingNewElement') {
          // this.tagBeingEdited = data.data.emailCampaignDtl.emailBodyDtl[0];
          await this.emailCommonService.setEmailTempelate(data.data.emailCampaignDtl);
          if (this.tagBeingEdited.style == null) {
            this.tagBeingEdited.style = {};
          }
          var index = data.data.emailCampaignDtl.emailBodyDtl.findIndex(e=> e.tagId == this.tagBeingEdited.tagId)
         console.log(index);
          if(index >= 0){
              this.tagBeingEdited = data.data.emailCampaignDtl.emailBodyDtl[index];
              console.log(this.tagBeingEdited);
          }
          if( this.tagBeingEdited.tag == 'column'){
            this.toggleToSBList();
          }
        } else {
          // debugger;
          await this.emailCommonService.updateEmailTempelate(data.data.emailCampaignDtl.emailBodyDtl);
        }
        if (addintNewElement == 'Apply') {
          this.toggleToSBList();
         }
        // localStorage.setItem("emailTemplateId", data.data.emailCampaignDtl.id);
        this.getTempelatData();
        if(onColumnAdded) {
          // back to side bar elements
          this.activeSB = "";
          this.columnAdded = false; // set this to let user add new column after toggling side bar to list 
        }
  
        if (this.tagBeingEdited.tag == "text") {
          this.editFocus(this.tagBeingEdited.tag, this.tagBeingEdited);
        }
  
      } else {
        this.commonService.serverError(data);
      }
    }
    
  }
  onInputTextHF(type, event) {

    let el;

    if (type == 'header') {

      this.tagBeingEdited = event;
      this.tagBeingEdited.index = 1;
      this.openActiveTab();

      if (event.tag == 'text' || event.tag == 'title') {
        el = document.getElementById(event.tagId).children[0].children[0];
        // update focused item's text property from this.tags array, for saving purpose
        // find by tagId
        let itemIH: any = el.innerHTML;
        // update text property of tags
        this.headerTag.text = itemIH;
      } else if (event.tag == 'button') {

        el = document.getElementById(event.tagId).children[0].children[0].children[0];

        // update focused item's text property from this.tags array, for saving purpose
        // find by tagId
        let itemIH: any = el.innerHTML;

        // update text property of tags
        this.headerTag.text = itemIH;
      }

    } else {

      this.tagBeingEdited = event;
      this.tagBeingEdited.index = this.tagsRef.length;
      this.openActiveTab();

      if (event.tag == 'text') {
        el = document.getElementById(event.tagId).children[0].children[0];
        // console.log("for button", document.getElementById(event.tagId), "event", event);
        // update focused item's text property from this.tags array, for saving purpose
        // find by tagId
        let itemIH: any = el.innerHTML;
        // update text property of tags
        this.footerTag.text = itemIH;
      } else if (event.tag == 'button') {

        el = document.getElementById(event.tagId).children[0].children[0].children[0];

        console.log('for button', el, 'event', event);

        // update focused item's text property from this.tags array, for saving purpose
        // find by tagId
        let itemIH: any = el.innerHTML;

        // update text property of tags
        this.footerTag.text = itemIH;
      }
    }
  }
  
  openActiveTab() {
    if (this.tagBeingEdited.tag == 'text' || this.tagBeingEdited.tag == 'title') {
      this.setActiveSB('AddText')
    } else if (this.tagBeingEdited.tag == 'logo') {
      this.setActiveSB('AddLogo')
    } else if (this.tagBeingEdited.tag == 'button') {
      this.setActiveSB('AddButton')
    } else if (this.tagBeingEdited.tag == 'image') {
      this.setActiveSB('AddImage')
    } else if (this.tagBeingEdited.tag == 'column') {
      this.setActiveSB('AddColumn')
    } else if (this.tagBeingEdited.tag == 'divider') {
      this.activeTab = 'sStyle';
      this.setActiveSB('AddSpacer')
    } else if (this.tagBeingEdited.tag == 'footer') {
      this.setActiveSB('AddFooter')
    }
  }
  async formatDoc(sCmd, sValue):Promise<void> {
    console.log(sCmd+":"+sValue);
    var oDoc = document.getElementById(this.tagBeingEdited.tagId);
    document.execCommand(sCmd, false, sValue);
    oDoc.focus();
  }
  previousSelectionText: any = {};

  spacerHeight: any = 0
  linkToUrlInValid ;
  checkWebsiteUrlIsValid(){
    this.linkToUrlInValid = this.common.urlPattern.test(this.linkTo);
  }
  async updateFont(event, action) {
    console.log("window.getSelection()", window.getSelection());
    // debugger;
    console.log(event)
    if (this.tagBeingEdited.style == null ) {
      this.tagBeingEdited.style = {};
    }
    var styleStr = null;
    var actionType = null;
    if (action == 'Font Style') {
      this.formatDoc('fontname', this.selectedFont)
    } else if(action == 'Heading'){
      if(event > 0){
        $("#text"+this.tagBeingEdited.tagId).css("font-size",event+"px");
        this.fontSize = event;
      }else{
        $("#text"+this.tagBeingEdited.tagId).css('font-size','');
        this.fontSize = 12;
      }
      this.tagBeingEdited.style.fontSize = this.fontSize+"px";
    }else if (action == 'Bold') {
      this.formatDoc('bold', null)
    } else if (action == 'Underline') {
      this.formatDoc('underline', null)
    }else if (action == 'Align') {
      this.formatDoc(event, null)
    } else if (action == 'Italic') {
      this.formatDoc('italic', null)
    } else if (action == 'Decrease Indent') {
      this.formatDoc('outdent', null);
    } else if (action == 'Increase Indent') {
      this.formatDoc('indent', null);
    } else if (action == 'UnLink') {
      this.formatDoc('unlink', null);
      this.formatDoc('removeFormat', null);
      var range = window.getSelection().getRangeAt(0);
      var parent = $(range.commonAncestorContainer);
      console.log($(range.commonAncestorContainer));
        if(parent[0].nodeName == '#text' && parent[0].parentElement.tagName == 'SPAN'){
           var cnt = $(parent[0].parentElement).contents();
                     $(parent[0].parentElement).replaceWith(cnt);
        }
    } else if (action == 'Link') {
      await this.restoreSelection(this.selectionRange);
      await this.formatDoc('createlink', this.linkTo);
      this.linkToWindow = false;
      var paraTag : any ={}
      if(this.tagBeingEdited.subTag == false)
      paraTag = $('#'+"text"+this.tagBeingEdited.tagId+' a')
      else
      paraTag = $('#'+"column"+this.tagBeingEdited.tagId+' a')
      console.log(paraTag);
      for(var i=0; i< paraTag.length ; i++){
        $(paraTag[i]).css({"text-decoration":"underline"})
        console.log(paraTag[i]);
      }
      console.log($('#'+"text"+this.tagBeingEdited.tagId+' a'));
    } else if (action == 'Strikethrough') {
      this.formatDoc('strikeThrough', null);
    } else if (action == 'BackgroundColor') {
      this.formatDoc('backcolor', this.backgroundColor);
    } else if (action == 'Color') {
      console.log('Font Color:' + this.fontColor)
      this.formatDoc('forecolor', this.fontColor);
    } else if (action == 'Bullets') {
      this.formatDoc('insertunorderedlist', null);
    } else if (action == 'Number') {
      this.formatDoc('insertorderedlist', null);
    } else if (action == 'UnFormat') {
      this.formatDoc('removeFormat', null);
      var range = window.getSelection().getRangeAt(0);
      var parent = $(range.commonAncestorContainer);
      console.log($(range.commonAncestorContainer));
        if(parent[0].nodeName == '#text' && parent[0].parentElement.tagName == 'SPAN'){
           var cnt = $(parent[0].parentElement).contents();
                     $(parent[0].parentElement).replaceWith(cnt);
        }
    } else if (action == 'Capitalization') {
      this.tagBeingEdited.style['text-transform'] = event.target.value;
      styleStr = 'text-transform:' + event.target.value;
      actionType = 'text-transform'
    } else if (action == 'CharSpacing') {
      this.tagBeingEdited.style['letter-spacing'] = this.charSpacing + 'px';
      styleStr = 'letter-spacing:' + this.charSpacing + 'px';
      actionType = 'letter-spacing'
    } else if (action == 'LineSpacing') {
      this.tagBeingEdited.style['line-height'] = this.lineSpacing;
      styleStr = 'line-height:' + this.lineSpacing;
      actionType = 'line-height'
    } else if (action == 'Font Size') {
     if(event){
      this.tagBeingEdited.style['font-size'] = parseInt(event.target.value)
      styleStr = 'font-size:' + parseInt(event.target.value) + 'px';
     }else{
      this.tagBeingEdited.style['font-size'] = this.fontSize;
      styleStr = 'font-size:' + this.fontSize + 'px';
     }
      actionType = 'font-size'
      console.log(this.tagBeingEdited.style);
    } else if (action == 'spacerHeight') {
      this.tagBeingEdited.style['margin-top'] = this.spacerHeight / 2;
      this.tagBeingEdited.style['margin-bottom'] = this.spacerHeight / 2;
    }

    if (window.getSelection() && styleStr != null && actionType != null) {
      var range = window.getSelection().getRangeAt(0);
      var parent = $(range.commonAncestorContainer);
      console.log($(range.commonAncestorContainer));
      if (parent[0].nodeName == '#text') {
        if (window.getSelection().toString() === parent[0].parentNode.innerText && (parent[0].parentNode.nodeName == 'P' || parent[0].parentNode.nodeName == 'SPAN')) {
          this.changeSelectedTextStyle(parent[0].parentElement, actionType, styleStr);
        } else {
          console.log(window.getSelection().toString() + ' : ' + parent[0].parentNode.innerText)
          var span = document.createElement('span');
          console.log(this.tagBeingEdited.style);
          $(span).css(this.tagBeingEdited.style);
          console.log(span);
          var sel = window.getSelection();
          if (sel.rangeCount) {
            this.cdr.detectChanges();
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
            this.tagBeingEdited.style = {};
          }
        }
      } else if (parent[0].nodeName == 'P' || parent[0].nodeName == 'SPAN' || parent[0].nodeName == 'B' || parent[0].nodeName == 'H1') {
        //console.log(window.getSelection() + " : " + parent[0].firstElementChild.innerText)
        var sameSelection = 0;
        parent[0].childNodes.forEach(child => {
          if (window.getSelection() == child.innerText) {
            console.log('Same Selection: ' + child.innerText);
            console.log(child);
            console.log(child.attributes.style.nodeValue);
            sameSelection++;
            this.changeSelectedTextStyle(child, actionType, styleStr);
          }
        })
        if (sameSelection == 0) {
          var range = window.getSelection().getRangeAt(0);
          // console.log(range.extractContents())
          var span = document.createElement('span');
          $(span).css(this.tagBeingEdited.style);
          span.appendChild(range.extractContents());
          var spanMessage = '';
          span.childNodes.forEach(child => {
            console.log(child);
            if (child.nodeName == 'SPAN' || child.nodeName == '#text') {
              spanMessage += child.textContent;
            }
          })
          //console.log(span.childNodes);
          span.removeChild(span.firstChild);
          span.innerText = spanMessage;
          range.insertNode(span);
          this.tagBeingEdited.style = {};
          parent[0].childNodes.forEach(child => {
            if (child.nodeName == 'SPAN') {
              if (child.innerText == '') {
                console.log('Empty Text: ' + child.innerText);
                parent[0].removeChild(child);
              } else {
                console.log(child.innerText);
              }
            }
          })
        }
      }
    }

  }

  selectionRange:any;
  storeWindowSelection(event){
    console.log(event);
    
    if(window.getSelection()){
      var sel :any = window.getSelection();
      if(sel.getRangeAt && sel.rangeCount){
        this.selectionRange = sel.getRangeAt(0);
      }
    }else if(document.createRange()){
      this.selectionRange = document.createRange();
    }
    if(event.target.tagName == 'SPAN'){
        this.editDynamicValue(event.target);
    }
  }

  async onKeydown(event){
    if(event.key == 'Backspace'){
      var selection = window.getSelection();
      if (selection.rangeCount === 1) {
      // get container of cursor
      var textnode = selection.getRangeAt(0);
      var parent = $(textnode.commonAncestorContainer);
      if(parent[0].parentElement.tagName == 'SPAN' && parent[0].parentElement.className == 'dynamicValue'){
        console.log(parent[0].parentElement.id);
        var result = parent[0].parentElement.id.match(/[^\d]+|\d+/g);
        // alert(result);
        $(parent[0].parentElement).remove();
        var index = this.tagBeingEdited.dynamicValues.findIndex(e=> e.id == result[1]);
             console.log(index);
             if(index > -1){
              this.tagBeingEdited.dynamicValues.splice(index, 1);
        }
      }
    }
    }
  }

  async restoreSelection(range): Promise<void>{
    if (range) {
      if (window.getSelection) {
          var sel = window.getSelection();
          console.log("Restore Selection: ",sel);
          sel.removeAllRanges();
          sel.addRange(range);
      } else if (range.select) {
          range.select();
      }
    }
  }
  addRemoveActiveClass(event,bulletOrNummber ?: string){
      console.log(event.target.classList);
      console.log($(event.target).hasClass("active"))
      if(!$(event.target).hasClass("active")){
        $(event.target).addClass("active")
      }else{
        $(event.target).removeClass("active")
      }

      if(bulletOrNummber){
        if($("#"+bulletOrNummber).hasClass("active")){
          $("#"+bulletOrNummber).removeClass("active")
        }
      }
  }
  changeSelectedTextStyle(child, actionType, styleStr) {
    var styles = [];
    if(child.attributes.style){
      styles = child.attributes.style.nodeValue.split(';');
      console.log(styles);
      for (var i = 0; i < styles.length; i++) {
        if (styles[i].includes(actionType)) {
          styles.splice(i, 1);
        } else if (styles[i] == '') {
          styles.splice(i, 1);
        }
      }
      styles.push(styleStr);
      var styles = styles.filter((el) => {
        return el != '';
      });
      console.log(styles);
      child.attributes.style.nodeValue = styles.join(' ; ');
      child.attributes.style.nodeValue += ';';
      console.log(child.attributes.style.nodeValue);
      this.tagBeingEdited.style = {};
    }else{
      var selection= window.getSelection().getRangeAt(0);
      var selectedText = selection.extractContents();
      var span= document.createElement("span");
      if(this.tagBeingEdited.style['line-height']){
        span.style.lineHeight = this.tagBeingEdited.style['line-height']+"px";
      }
      if(this.tagBeingEdited.style['font-size']){
        span.style.fontSize = this.tagBeingEdited.style['font-size']+"px";
      }
      if(this.tagBeingEdited.style['letter-spacing']){
        span.style.letterSpacing = this.tagBeingEdited.style['letter-spacing'];
      }
      span.appendChild(selectedText);
      selection.insertNode(span);
      this.tagBeingEdited.style = {};
      // console.log(this.tagBeingEdited.style);
      // $("#text"+this.tagBeingEdited.tagId).css(styleStr);
    }
    
  }

  async saveEmailCampaing() {
    // do not make extra save api calls, if email type is of broad cast only allow save api once and the length of the emailCampaign array is 1
    // this.emailCampaignData.emailCampaignDtl
    console.log("Saving Initial Template");
    await this.updateHtmlText();
    let emailCampaign = await this.getEmailCampaignPayload();
    var data: any;
    if(this.emailCommonService.updateEmailBody == false){
      data = await this.service.createEmailCampaign(emailCampaign);
    }else{
      data = await this.emailCommonService.changeEmailBody(emailCampaign);
      this.emailCommonService.updateEmailBody = false;
    }
    if (data.status == 'SUCCESS') {
      console.log(data.data);
      await this.emailCommonService.setEmailTempelate(data.data.emailCampaignDtl);
      localStorage.setItem("emailTemplateId", data.data.emailCampaignDtl.id);
      this.getTempelatData();
    } else {
      this.commonService.serverError(data);
    }
  }

  async getEmailCampaignPayload() {
    console.log(this.tagsRef);
    var emailTemplate: any = {
      emailTitle: "Email Name "+(this.emailCampaignData.emailCampaignDtl.length+1),
      emailBodyDtl: this.tagsRef
    }
    if(this.emailTemplate.emailTitle){
      emailTemplate.emailTitle = this.emailTemplate.emailTitle;
    }
    console.log(localStorage.getItem("emailTemplateId"));
    if (localStorage.getItem("emailTemplateId")) {
      emailTemplate.id = localStorage.getItem("emailTemplateId")
    }
    if(this.emailTemplateName.id){
      var templateId :any ={  id: this.emailTemplateName.id };
      emailTemplate.emailTemplate = templateId;
    }else{
      emailTemplate.emailTemplate = { id: 1 };
    }
    console.log(localStorage.getItem("emailCampaignId"));
    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailTemplate]
    }
    console.log(emailCampaign);

    return emailCampaign;
  }

  openLinkToWindow() {
    if (this.linkToWindow == false) {
      this.linkToWindow = true;
      this.previousSelectionText = window.getSelection();
    } else {
      this.linkToWindow = false;
    }
  }

  alignmentWindow = false;
  openAlignmentMenu(action) {
    if (action == null)
      this.alignmentWindow = true;
    else {
      this.alignmentWindow = false
      //document.getElementById("alignIcon").src = action.image;
      $('#alignIcon').attr('src', action.image);
      var para = document.getElementById(this.tagBeingEdited.tagId);
      para.style.textAlign = action.value

    }
  }

  selectionWindow: any;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
  }

  listSorted(list: any) {
    this.tags = list;
    setTimeout(() => {
      this.saveEmailCampaing();
    }, 200)
  }

  listStyle: any = {
    width: 'inherit', //width of the list defaults to 300
    height: 'inherit', //height of the list defaults to 250
  }

  // handles draggable logic
  columnBeingEdited = 0;
  oldTagBeingEdited : any;
  onEditorItemClick(item) {

    console.log('editor item clicked', item);
    if(this.tagBeingEdited.tagId != item.tagId){
        // this.oldTagBeingEdited = [...item];
      if(item.subTag == true){
        this.tags.forEach(element=>{
          if(element.tag == 'column'){
            
            element.subTags.forEach(subT =>{
                 if(item.id == subT.id && item.id != undefined){
                   console.log(item.id+":"+subT.id)
                   this.columnBeingEdited = element.id;
                 }
            })    
          }
        })
        if(this.columnBeingEdited == 0)
        this.savePreviouslyFocusedElement('AddingNewElement', true);
      }
      
      let els: any = document.getElementsByClassName('sortable-list')[0].children;
  
      // if (item && item.tagType) {
  
      //   this.setActiveColumn(item.tagType);
      // }
  
      if (els) {
        // removes the draggable feature from current selected element, 
        // once the other element is clicked, returns the draggable feature with last active class
        for (let ele in els) {
  
          let el: any = els[ele];
  
          if (el && el.childNodes && document.getElementById(item.tagId) == el.childNodes[2]) {
            // if (el && el.childNodes && document.getElementById(item.tagId) == el.childNodes[2].childNodes[4].childNodes[0]) {
  
            // console.log("match");
  
            // this.onInputText(item);
  
            document.getElementById(item.tagId).parentElement.setAttribute('draggable', '');
  
            document.getElementById(item.tagId).parentElement.setAttribute('style', 'background: transparent !important;');
          } else {
  
            // if (el.hasOwnProperty('setAttribute')) {
            // console.log("no match");
  
            if (el.setAttribute) {
              el.setAttribute('draggable', 'true');
            }
  
            if (el.childNodes && el.childNodes[2]) {
              el.childNodes[2].parentElement.setAttribute('style', 'background: inherit !important;');
            }
            // }
          }
        };
      }
    }
    
  }

  addLinkToImage: boolean = false;
  changeImage(action, event) {
    if(this.tagBeingEdited.style == null){
      this.tagBeingEdited.style = {};
    }
    if (action == 'ImageWidth') {
      document.getElementById('image' + this.tagBeingEdited.tagId).style.width = this.imageWidth + '%';
      this.tagBeingEdited.style.width = this.imageWidth + '%';
    } else if (action == 'VerticalSpacing') {
      this.tagBeingEdited.style.marginTop = this.verticalSpacing;
      if(this.tagBeingEdited.style.aligment){
        this.settingMarginForComponent(this.tagBeingEdited.style.aligment);
      }else{
        this.settingMarginForComponent("Left");
      }
      // var imageTag = document.getElementById('image' + this.tagBeingEdited.tagId);
      // imageTag.style.marginTop = this.verticalSpacing + 'px';
      // this.tagBeingEdited.style.marginTop = this.verticalSpacing + 'px';
      console.log(this.tagBeingEdited);
    } else if (action == 'Link') {
      // this.formatDoc('createlink',this.linkTo);
      var a = document.createElement('a');
      a.href = this.tagBeingEdited.linkUrl;
      $('#image' + this.tagBeingEdited.tagId + ' img').wrap(a);
    } else if (action == 'Remove Link') {
      this.tagBeingEdited.linkUrl = "";
      $('#image' + this.tagBeingEdited.tagId + ' a').contents().unwrap();
    } else if (action == 'AltText') {
      this.tags[this.tagBeingEdited.index].altText = event.target.value;
    }
  }
  onOfLink(event) {
    console.log(event);
    if(event.target.checked == undefined){
      $("#showLinkOnOffswitch").trigger("click");
    }else if (event.target.checked == false) {
      this.addLinkToImage = false;
      this.changeImage('Remove Link',null)
    } else {
      this.addLinkToImage = true;
    }
  }
  changeImageAlignment(event, direction) {
    var list: any = [];
    list = document.getElementsByClassName('alig-label');
    for (let item of list) {
      // console.log(item);
      if ($(item) && $(item).hasClass('activeImageAlign')) {
        $(item).removeClass('activeImageAlign')
      }
    }
    if (event.target.childNodes.length == 0) {
      $(event.target.parentNode).addClass('activeImageAlign');
    } else {
      $(event.target).addClass('activeImageAlign');
    }
    this.settingMarginForComponent(direction);
    
  }
  settingMarginForComponent(direction){
    if (direction == 'Left') {
      var image = document.getElementById('image' + this.tagBeingEdited.tagId)
      //console.log(margin)
      // if(this.verticalSpacing == 0){
      image.style.margin = this.verticalSpacing + 'px 0px '
      //}
    } else if (direction == 'Center') {
      var image = document.getElementById('image' + this.tagBeingEdited.tagId)
      //console.log(margin)
      //if(image.style.margin == ""){
      image.style.margin = this.verticalSpacing + 'px auto'
      //}
    } else{
      var image = document.getElementById('image' + this.tagBeingEdited.tagId)
      //console.log(margin)
      //if(image.style.margin == ""){
      image.style.margin = this.verticalSpacing + 'px 0px ' + this.verticalSpacing + 'px auto'
      //}
    }
    this.tagBeingEdited.style.margin = image.style.margin;
    this.tagBeingEdited.style.aligment = direction;
  }
  public color: string = '#000000';

  //color picker related functions
  public onEventLog(event: string, data: any): void {

    this.updateSpacer('color');
  }
  selectedSpacerLine:any={};
  activeSpacer;
  dividerLineSvg= null;
  updateSpacer(type?: any, value?: any) {
    console.log(value);
    this.tagBeingEdited.isUpdated = 'True';
    let spacerEle = document.getElementById("divider"+this.tagBeingEdited.tagId)
    if(type == 'Image'){
      this.sStroke = 1;
      this.sHeight = 10;
      this.sWidth = 100;
      this.selectedSpacerLine = value;
      if(value.dividerType == 'Image'){
        this.tagBeingEdited.spacerId = value.id;
        this.tagBeingEdited.style={};
        this.tagBeingEdited.style['border-top'] = "none";
        spacerEle.setAttribute('style', `border-top: none`);
        
        document.getElementById("dividerSvg"+this.tagBeingEdited.tagId).style.display = 'block';
        this.tagBeingEdited.src = value.image;
        // this.dividerLineSvg = "assets/icons/divider_images/space_brown.svg";
        // var htmlText = '<div class="my-icon" aria-label="My icon" [inlineSVG]="'+image+'"></div>'
        // $("#divider"+this.tagBeingEdited.tagId).html(htmlText);
       // console.log(htmlText)
        // $("#divider"+this.tagBeingEdited.tagId).css({"background-image": "url(" + value.image + ")", "background-repeat": "no-repeat", "background-position": "center",
        // "background-size": "15%"});
        //this.tagBeingEdited.style['background-image'] = "url(" + value.image + ")";
        // this.tagBeingEdited.style['background-repeat'] = "no-repeat";
        // this.tagBeingEdited.style['background-position'] = "center";
        // this.tagBeingEdited.style['background-size'] = "15%";
        // if(value.style){
        //   $("#divider"+this.tagBeingEdited.tagId).css(value.style);
        //   if(value.style['background-size']){
        //     this.tagBeingEdited.style['background-size'] = value.style['background-size']
        //   }
        //   if(value.style['background-repeat']){
        //     this.tagBeingEdited.style['background-repeat'] = value.style['background-repeat'];
        //   }
        // }
      }else{
        this.tagBeingEdited.style={};
        this.tagBeingEdited.spacerId = value.id;
        $("#divider"+this.tagBeingEdited.tagId).removeAttr("style");
        this.tagBeingEdited.src = null;
        $("#divider"+this.tagBeingEdited.tagId).css("border-top-style",value.dividerType);
        this.tagBeingEdited.style['border-top-color'] = this.color;
        $("#divider"+this.tagBeingEdited.tagId).css("border-top-color", this.color);
        this.tagBeingEdited.style['border-top-style'] = value.dividerType;
        if(value.style){
          this.tagBeingEdited.style['border-width'] = this.selectedSpacerLine.style['border-width'];
          var borderWidth = this.selectedSpacerLine.style['border-width'];
          this.sStroke = parseInt(borderWidth, 10);
          $("#divider"+this.tagBeingEdited.tagId).css(value.style);
          // if(this.selectedSpacerLine.style['border-top-color']){
          //   this.color = this.selectedSpacerLine.style['border-top-color'];
          // }
        }
      }
    }else{
      if(type == 'width'){
        $("#divider"+this.tagBeingEdited.tagId).css("width",this.sWidth+"%");
        this.tagBeingEdited.style['width'] = this.sWidth+"%"
      }else if(type == 'stroke'){
        $("#divider"+this.tagBeingEdited.tagId).css("border-width",this.sStroke+"px");
        this.tagBeingEdited.style['border-width'] = this.sStroke+"px";
      }else if(type == 'height'){
        $("#divider"+this.tagBeingEdited.tagId).css("margin",( this.sHeight / 2) +"px auto "+( this.sHeight / 2)+"px");
        this.tagBeingEdited.style['margin'] = ( this.sHeight / 2) +"px auto "+( this.sHeight / 2)+"px";
      }else if(type == 'display'){
        if(value.srcElement.checked == true){
          if(this.selectedSpacerLine.dividerType == 'Image'){
            this.tagBeingEdited.src = this.selectedSpacerLine.image;
            // this.tagBeingEdited.style['background-image'] =  "url(" + this.selectedSpacerLine.image+ ")";
            // $("#divider"+this.tagBeingEdited.tagId).css("background-image", "url(" + this.selectedSpacerLine.image + ")");
          }else{
            this.tagBeingEdited.style['border-top-style'] = this.selectedSpacerLine.dividerType;
            $("#divider"+this.tagBeingEdited.tagId).css("border-top-style", this.selectedSpacerLine.dividerType);
          }
        }
       else{  
         if(this.selectedSpacerLine.dividerType == 'Image'){
          this.tagBeingEdited.src = null;
          // this.tagBeingEdited.style['background-image'] = "none";
          //  $("#divider"+this.tagBeingEdited.tagId).css("background-image","none");
         }else{
          this.tagBeingEdited.style['border-top-style'] = "none";
          $("#divider"+this.tagBeingEdited.tagId).css("border-top-style", "none");
         }
       }
      }else if(type == 'color'){
        console.log(this.selectedSpacerLine.dividerType);
        if(this.selectedSpacerLine.dividerType == 'Image'){
          this.tagBeingEdited.style['stroke'] = this.color;
          //$("#dividerSvg"+this.tagBeingEdited.tagId).css("stroke", this.color);
          var svgImg = $("#divider"+this.tagBeingEdited.tagId+" .my-icon")
          var dividerImg = svgImg[0];
          console.log(svgImg);
            var x = $(dividerImg).children()[0]
            x.setAttribute( 'style', 'stroke: '+this.color+' '  );
            console.log(x);

          console.log(this.tagBeingEdited.style);
        }else{
          this.tagBeingEdited.style['border-top-color'] = this.color;
          $("#divider"+this.tagBeingEdited.tagId).css("border-top-color", this.color);
        }
      }
    }
    
  }
  async setActiveSpacer(spacer){
    this.activeTab = 'sStyle'
    this.selectedSpacerLine = this.dividerLine.find(e => e.id == spacer)
    if(this.tagBeingEdited.id  && this.tagBeingEdited.tagId != null){
      if(this.selectedSpacerLine.dividerType == 'Image'){
        if(this.tagBeingEdited.style.stroke){
          this.color = this.tagBeingEdited.style.stroke;
        }
      }else{
        if(this.tagBeingEdited.style['border-top-color']){
          this.color = this.tagBeingEdited.style['border-top-color'];
        }
      }
    }else{
      console.log("SetActiveSb");
      this.tagBeingEdited.style['border-top'] = '1px solid ' +this.color;
     $("#divider"+this.tagBeingEdited.tagId).css("border-top", '1px solid ' +this.color);
     console.log(this.tagBeingEdited);
    }
    this.activeSpacer = spacer;
  }
  validateSliderValue(type, options) {

    if (type == 'sHeight') {

      if (this.sHeight > options.ceil) {

        this.sHeight = options.ceil.toString();
      }
    } else if (type == 'sWidth') {
      if (this.sWidth > options.ceil) {

        this.sWidth = options.ceil.toString();
      }
    } else if (type == 'sStroke') {

      if (this.sStroke > options.ceil) {

        this.sStroke = options.ceil.toString();
      }
    }
  }

  activeColumn: number = 0;

  setActiveColumn(order) {

    this.activeColumn = order;

    // this.setActiveSB("column"+this.activeColumn);
  }
  performClick(elemId) {
    var elem = document.getElementById(elemId);
    if (elem && document.createEvent) {
      var evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      elem.dispatchEvent(evt);
    }
  }
  addNewImage = false;
  fileType;
  isBackgroundPattern = false;
  openSelectFileModel(event, background?: String) {
    this.pdfSrc = null;
    if (document.getElementById('selectImageModal').style.display == 'none' ||
     document.getElementById('selectImageModal').style.display == undefined ||
     document.getElementById('selectImageModal').style.display == "") {
      document.getElementById('selectImageModal').style.display = 'block'
      if (event == 'Image') {
        this.addNewImage = true;
        this.fileType = 'Image'
      } else {
        this.fileType = 'File'
      }
      if (background) {
        this.isBackgroundPattern = true;
      }

    } else {
      this.fileType = null;
      document.getElementById('selectImageModal').style.display = 'none'
      document.getElementById('selectFile').style.display = 'block';
      document.getElementById('changeFile').style.display = 'none';
      if (event == 'Image') {
        this.addNewImage = false;
        this.isBackgroundPattern = false;
      }else{
        if(this.tagBeingEdited.buttonFile){
          var fileName = this.tagBeingEdited.buttonFile.split("/");
          this.pdfSrc = fileName[fileName.length-1];
        }
      }
    }

  }
  // deleteEmailCampaignItem(item){
  //   if(item.tag == 'logo'){
  //     this.logoTag = {}
  //     this.hasLogo = false;
  //   }
  //   this.toggleToSBList();
  // }
  showAddress = true;
  showPhoneNumber = true;
  showShareVia = true;
  showAddUrl = true;
  showPinterest = true;
  showFacebook = true;
  showTwitter = true;
  noOfAreaHidden = 0;
  footerOnOffButton(event, action) {
    var checked = event.target.checked;
    if (action == 'Address')
      this.showAddress = checked;
    else if (action == 'PhoneNumber')
      this.showPhoneNumber = checked;
    else if (action == 'Share')
      this.showShareVia = checked;
    else if (action == 'AddUrl')
      this.showAddUrl = checked;
    else if (action == 'Pinterest')
      this.showPinterest = checked;
    else if (action == 'Facebook')
      this.showFacebook = checked
    else if (action == 'Twitter')
      this.showTwitter = checked

    var footer = document.getElementsByClassName('last')
    if ((action == 'Address' || action == 'PhoneNumber') && (this.showAddress == false && this.showPhoneNumber == false))
      this.noOfAreaHidden++;
    if (action == 'Share' && this.showShareVia == false)
      this.noOfAreaHidden++;
    if (action == 'AddUrl' && this.showAddUrl == false)
      this.noOfAreaHidden++

    if ((action == 'Address' || action == 'PhoneNumber') && (this.showAddress == true || this.showPhoneNumber == true) && this.noOfAreaHidden != 0)
      this.noOfAreaHidden--;
    if (action == 'Share' && this.showShareVia == true)
      this.noOfAreaHidden--;
    if (action == 'AddUrl' && this.showAddUrl == true)
      this.noOfAreaHidden--;

    if (this.noOfAreaHidden == 1)
      $('.col-lg-6').css('max-width', '50%');
    else if (this.noOfAreaHidden == 2)
      $('.col-lg-6').css('max-width', '100%');
    else if (this.noOfAreaHidden == 0)
      $('.col-lg-6').css('max-width', '32%');
  }


  changeButtonText(event, action) {
    if (action == 'Label')
      this.tags[this.tagBeingEdited.index].text = event.target.value;
    else if (action == 'URL') {
      var url;
      if (event == null) {
        url =this.common.baseurl+"/emailCampaign/email/click?trackToken=<<trackToken>>&url="+this.tagBeingEdited.buttonFile;

        this.openSelectFileModel(this.fileType);
      } else {
        url = this.common.baseurl+"/emailCampaign/email/click?trackToken=<<trackToken>>&url="+event.target.value;
      }
      var button = $('#button' + this.tagBeingEdited.tagId);
      if (button[0].parentNode.nodeName != 'A') {
        var a = document.createElement('a');
        a.href = url;
        $('#button' + this.tagBeingEdited.tagId).wrap(a);
        a.target = "_blank";
      } else {
        $(button[0].parentNode).attr('href', url);
      }
    }
  }
  
  buttonColor = '#1DCB9A';
  buttonTextColor = '#ffff';
  borderColor = '#000000';
  borderWidth = 0;
  buttonBorderOptions: Options = {
    floor: 0,
    ceil: 10,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  changeButtonColor(event, action) {
    // console.log(action+":"+this.buttonColor)
    if (action == 'TextColor') {
      document.getElementById('button' + this.tagBeingEdited.tagId).style.color = this.buttonTextColor;
      this.tagBeingEdited.style.color = this.buttonTextColor;
    } else if (action == 'ButtonColor') {
      document.getElementById('ActionButton' + this.tagBeingEdited.tagId).style.backgroundColor = this.buttonColor;
      this.tagBeingEdited.style.backgroundColor = this.buttonColor;
    } else if (action == 'BorderColor') {
      this.tagBeingEdited.style.borderColor = this.borderColor;
      document.getElementById('ActionButton' + this.tagBeingEdited.tagId).style.borderColor = this.borderColor;
    } else if (action == 'BorderWidth') {
      this.tagBeingEdited.style.borderWidth = this.borderWidth + 'px';
      document.getElementById('ActionButton' + this.tagBeingEdited.tagId).style.borderWidth = this.borderWidth + 'px';
    }

  }
  updateButtonStyle(event, action) {
    if(this.tagBeingEdited.style == null){
      this.tagBeingEdited.style = {};
    }
    if (action == 'Font Style') {
      var font = $(event.target);
      font = font[0].value;
      document.getElementById('button' + this.tagBeingEdited.tagId).style.fontFamily = font;
      this.tagBeingEdited.style.fontFamily = font;
    } else if (action.includes('Align')) {
      var list: any = [];
      list = document.getElementsByClassName('button-alig-label');
      for (let item of list) {
        // console.log(item);
        if ($(item) && $(item).hasClass('activeImageAlign')) {
          $(item).removeClass('activeImageAlign')
        }
      }
      if (event.target.childNodes.length == 0) {
        $(event.target.parentNode).addClass('activeImageAlign');
      } else {
        $(event.target).addClass('activeImageAlign');
      }
      var direction = action.split(' ');
      document.getElementById('buttonDiv' + this.tagBeingEdited.tagId).style.textAlign = direction[1];
      this.tagBeingEdited.style.textAlign = direction[1];
    }
  }

  showBorder = 0;
  showHoverBorder(tag) {
    if (this.tagBeingEdited.tagId != tag.tagId) {
      this.showBorder = tag.tagId;
    }
  }

  removeHoverBorder() {
    this.showBorder = 0;
    this.showDeleteButton ="";
  }

  async preview() {
    await this.updateHtmlText()

    this.router.navigate(['/preview'])
  }
  hoveredColumnItem: any = {
    tagId: 'none'
  };;
  onColumnItemHover(event, item) {
    // console.log("item in highlightRow", item);
    if (item)
      this.hoveredColumnItem = item;
    else
      this.hoveredColumnItem = {
        tagId: 'none'
      };

    // event.stopPropagation();
  }
  showDeleteButton;
  showDeleteText(tag){
    this.showDeleteButton = tag.tagId;
  }
  async deleteEditorItem(eItem) {
    console.log(eItem)
    let item = Object.assign({}, eItem);
    if (item.tag == 'text') { this.textBoxCount--; }
    if (item.tag == 'image') { this.imageCount--; }
    if (item.tag == 'button') { this.buttonCount--; }
    if (item.tag == 'divider') { this.dividerCount--; }
    if (item.tag == 'column') { this.columnCount--; }
    console.log(item);
    if (item.tag == 'logo') {
      this.logoTag = {}
      this.hasLogo = false;
    } else {
      event.stopPropagation();
      this.tags.splice(item.index, 1);
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].index = i;
      }
    }
    if (item.id) {
      var data: any = await this.service.deleteEmailTemplateComponent(item.id);
      console.log(data);
      if (data.status == "SUCCESS") {

        this.emailCommonService.setEmailTempelate(data.data);
        this.getTempelatData();
      } else {
        this.commonService.serverError(data);
      }
    }
    this.tagBeingEdited = { style: {} };
    this.toggleToSBList();
  }

  duplicateItem(eItem) {
    let item = Object.assign({}, eItem);
    delete item.id;
    event.stopPropagation();
    if (item.tag == 'text') { item.tagId = "textBox" + this.textBoxCount; this.textBoxCount++ }
    if (item.tag == 'image') { item.tagId = "image" + this.imageCount; this.imageCount++; }
    if (item.tag == 'button') { item.tagId = "button" + this.buttonCount; this.buttonCount++; }
    if (item.tag == 'divider') { item.tagId = "divider" + this.dividerCount; this.dividerCount++ }
    if (item.tag == 'column') { 
      item.tagId = "column" + this.columnCount; 
      this.columnCount++;
      item.subTags.forEach(item => {
        item.tagId = "column" + this.columnCount;
        this.columnCount++;
      });
    }

    this.tags.splice(item.index + 1, 0, item);
    for (let i = 0; i < this.tags.length; i++) {
      this.tags[i].index = i;
    }
    this.tagBeingEdited = item;
    this.tagBeingEdited.compOrder = item.compOrder + 1;
    setTimeout(() => {
      this.savePreviouslyFocusedElement("AddingNewElement")
      if (this.tagBeingEdited.tag == "text")
        this.editFocus(this.tagBeingEdited.tag, this.tagBeingEdited);
    }, 200);
    event.stopPropagation();
  }

  async updateHtmlText(): Promise<void> {
    var logoTag;
    if (this.tagsRef[0].tagId == 'logo') {
      logoTag = this.tagsRef.findIndex(e => e.tag == 'logo')
      this.tagsRef.splice(logoTag, 1);
    }
    var headerTag = this.tagsRef.findIndex(e => e.tag == 'title')
    this.tagsRef.splice(headerTag, 1);
    var footerTag = this.tagsRef.findIndex(e => e.tag == 'footer')
    this.tagsRef.splice(footerTag, 1);
    this.tagsRef = this.tags;
    this.tagsRef.unshift(this.logoTag, this.headerTag);
    this.tagsRef.push(this.footerTag);
    var count = 0;
    this.tagsRef.forEach(ele => {
      if (ele.tag) {
        ele.compOrder = count;
        count++;
      }
    });
    this.tagsRef = this.tagsRef.filter(value => value.tag != null);
    this.tagsRef.forEach(element => {
      if (element.tag == 'logo' || element.tag == 'image') {
        var data = $('#image' + element.tagId);

        if (data[0]) {
          element.htmlText = data[0].outerHTML;
        }
      } else if (element.tag == 'title' || element.tag == 'text') {
       
        var data = $('#text' + element.tagId);
        // var dataDiv = $("#textDiv"+element.tagId);
        var childElements = data[0].childNodes;
        childElements.forEach( e=>{
          if(e.className == 'dynamicValue'){
                e.removeAttribute("style"); 
          }
        })
        data = $('#text' + element.tagId);
        var dataDiv = $("#textDiv"+element.tagId);
        element.text = data[0].innerHTML
        element.htmlText = dataDiv[0].outerHTML
        console.log("element.tag Text/Title", data )
      } else if (element.tag == 'button') {
        var data = $('#buttonDiv' + element.tagId);

        element.htmlText = data[0].outerHTML
      } else if (element.tag == 'footer') {
        var data = $('#footer' + element.tagId);
        element.htmlText = data[0].outerHTML
      } else if (element.tag == 'divider') {
        if(element.src == null){
          var data = $('#divider' + element.tagId);
          element.htmlText = data[0].outerHTML
        }else{
          this.svgUrlToPng(element.tagId);
        }
      } else if (element.tag == 'column') {
        var data = $('#column' + element.tagId);
        if (typeof element.id == "string") {
          delete element.id;
        }
        element.htmlText = data[0].outerHTML;
      }
    })
    this.tagsRef = this.tagsRef.filter(value => Object.keys(value).length !== 0);
    this.tagsRef = this.tagsRef.filter(value => value.tagId != null);
    this.tagsRef.forEach(element => {
      this.updateTagBeignEditedHtml(element);

    })
    this.emailCommonService.setEmailTempelateBodyDtl(this.tagsRef);
  }

  imageBase64: any;
  imageBase64RefObj: any = {};
  async setCropperImage () { 
    if (!this.tagBeingEdited.src.includes("data:") && this.tagBeingEdited.src.includes("http")) {
      const result: any = await fetch(this.tagBeingEdited.src);
      const blob = await result.blob();
      let reader: any = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.imageBase64 = "";
        this.imageBase64 = reader.result;
        this.imageBase64RefObj[this.tagBeingEdited.tagId] = this.imageBase64;
        this.cdr.detectChanges();
      }
    } else {
      // this is already a cropper image
      // added this to improve performance
      this.imageBase64 = this.imageBase64RefObj[this.tagBeingEdited.tagId];
    }
  }

  // image cropper related code
  imageChangedEvent: any;
  showImgCropper(item) {
    this.tagBeingEdited = item;
    this.setActiveSB('AddImage');
    this.imageBase64 = "";
    event.stopPropagation();
    document.getElementById("cropperModal").style.display = "block";
    // this.imageChangedEvent = null;
    // this.imageChangedEvent = item.event;
    // // this.onInputText(item, "");
    // this.tagBeingEdited = {};
    // this.tagBeingEdited = item;
    this.setCropperImage();
    this.cdr.detectChanges();

  }

  closeModel = function (option) {
    this.imageChangedEvent = null;
    this.cdr.detectChanges();
    document.getElementById("cropperModal").style.display = "none";
    if (option == 'OK') {
      this.tagBeingEdited.src = this.croppedImage;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // this.changedImage = true;
  }

  imageLoaded() {
    // show cropper
    this.cdr.detectChanges();
  }
  cropperReady() {
    // cropper ready
    this.cdr.detectChanges();
  }
  loadImageFailed() {
    this.imageChangedEvent = null;
  }

  innerEmailBorderColor = "#0000"
  emailBackgroundColor = "#E3E3E3";
  innerEmailBackgroundColor = "#fff"
  innerEmailBorderSize: number = 1;
  backgroundImageColor = "#E3E3E3"
  innerEmailBorderSizeOptions: Options = {
    floor: 0,
    ceil: 10,
    showSelectionBar: true,
    hidePointerLabels: true,
  };
  changeBackGroundColor(element, area, type?: any) {
    if (area == 'BackGround') {
      if (element == 'emailTemplateInnerWindow') {
        this.emailTemplate.innerBackground.innerBackColor = this.innerEmailBackgroundColor;
        this.emailTemplate.innerBackground.showBackgroundColor = true;
        document.getElementById(element).style.backgroundColor = this.innerEmailBackgroundColor;
      } else {
        this.emailTemplate.mainBackground.backgroundColor = this.emailBackgroundColor;
        this.emailTemplate.mainBackground.emailBackImage = {};
        document.getElementById(element).style.backgroundImage = "none";
        document.getElementById(element).style.backgroundColor = this.emailBackgroundColor;
      }
      console.log("ChangeBackground Color", this.emailTemplate);

      delete this.emailTemplate.mainBackground.emailBackImage;
      if ($('.bckroundImg') && $('.bckroundImg').hasClass('active')) {
      $('.bckroundImg').removeClass('active');
    }
    } else if (area == 'BackGround Image') {
      this.emailTemplate.mainBackground.imageBackColor = this.backgroundImageColor;
      document.getElementById(element).style.backgroundColor = this.backgroundImageColor;
    }
    else if (area == 'Border') {
      this.emailTemplate.innerBackground.borderColor = this.innerEmailBorderColor;
      document.getElementById(element).style.border = this.innerEmailBorderSize + "px" + " solid " + this.innerEmailBorderColor;
    } else if (area == 'BorderWidth') {
      this.emailTemplate.innerBackground.borderWidth = this.innerEmailBorderSize;
      document.getElementById(element).style.border = this.innerEmailBorderSize + "px" + " solid " + this.innerEmailBorderColor;
    } else if (area == 'CloseWindow') {
      //this.saveBackgrounds();
    } else {
      if (area.target.checked == true) {
        this.emailTemplate.innerBackground.showBackgroundColor = true;
        document.getElementById(element).style.backgroundColor = this.innerEmailBackgroundColor;
      } else {
        this.emailTemplate.innerBackground.showBackgroundColor = false;
        document.getElementById(element).style.backgroundColor = 'transparent';
      }
    }

  }
  editBackgroundImage() {
    if (document.getElementById("editBackground").style.display == 'none') {
      document.getElementById("swapp").style.display = 'none';
      document.getElementById("editBackground").style.display = 'block'
    } else {
      document.getElementById("editBackground").style.display = 'none';
      document.getElementById("swapp").style.display = 'block'
    }

  }

  async saveBackgrounds() {
    var emailTemplate: any = {}
    if(this.emailTemplate.mainBackground.emailBackImage){
      if(Object.keys(this.emailTemplate.mainBackground.emailBackImage).length == 0  ){
        delete this.emailTemplate.mainBackground.emailBackImage;
      }
    }
    if(Object.keys(this.emailTemplate.innerBackground).length != 0 ){
      emailTemplate.innerBackground = this.emailTemplate.innerBackground
    }
    if(Object.keys(this.emailTemplate.mainBackground).length != 0 ){
        emailTemplate.mainBackground = this.emailTemplate.mainBackground
    }
    if (localStorage.getItem("emailTemplateId")) {
      emailTemplate.id = localStorage.getItem("emailTemplateId")
    }
    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailTemplate]
    }
    console.log(emailCampaign);
    if(Object.keys(emailTemplate).length != 0 ){
      var data: any = await this.service.createEmailCampaign(emailCampaign);
      //console.log(data);
      if (data.status == 'SUCCESS') {
        this.emailCommonService.updateEmailTempelateData(data.data.emailCampaignDtl[0], 'Backgrounds');
        //localStorage.setItem("emailTemplateId", data.data.emailCampaignDtl[0].id);
        //this.getTempelatData();
      } else {
        this.commonService.serverError(data);
      }
    }
    
  }
  showTemplateTitleBorder(){
    document.getElementById("templateTitle").style.display = 'inline'
  }
  removeTemplateTitleBorder(){
     document.getElementById("templateTitle").style.display = 'none'
  }
  async saveEmailTempelateTitle(action){
    var emailTemplate: any ={
      id: this.emailTemplate.id
    };

    if(action == 'Title'){
      var text = document.getElementById("templateTitleText").innerText;
      emailTemplate.emailTitle = text;
      $("#editTitleImage").attr('src','assets/icons/pencil-edit-button (1).svg')
      $("#editTitleImage").attr('width','');
      $("#emailTitleEditButton").hide();
      var elem = document.getElementById("emailTitle");
      elem.style.borderBottom = 'none'

    }else if(action == 'Email Subject'){
      emailTemplate.emailSubject = this.emailTemplate.emailSubject;
    }else{
      emailTemplate.emailPreHeader = this.emailTemplate.emailPreHeader;
    }
    if (localStorage.getItem("emailTemplateId")) {
      emailTemplate.id = localStorage.getItem("emailTemplateId")
    }
    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailTemplate]
    }
    console.log(emailCampaign);
    var data: any = await this.service.createEmailCampaign(emailCampaign);
    console.log(data);
    if (data.status == 'SUCCESS') {
      this.emailCommonService.setEmailTempelateTitle(data.data.emailCampaignDtl);
      //this.emailCampaign.emailTitle = 
      //await this.emailCommonService.setEmailTempelate(data.data.emailCampaignDtl);
      //localStorage.setItem("emailTemplateId", data.data.emailCampaignDtl.id);
    } else {
      this.commonService.serverError(data);
    }
  }

  // Function for opening and closing the preheader dropdown
  openPreheaderDiv(){
    $("#subjectPreheaderDiv").toggle(500);
    var imgName = $("#openPreheaderDiv").attr("src")
    if(imgName.includes("arrow-down.svg")){
      $("#preHeaderSubject").hide();
      $("#preHeaderEmailFrom").show();
      $("#openPreheaderDiv").attr("src","./assets/icons/arrow-top.svg")
    }else{
      $("#preHeaderSubject").show();
      $("#preHeaderEmailFrom").hide();
      $("#openPreheaderDiv").attr("src","./assets/icons/arrow-down.svg")
    }
  }

  //Function for changing the style for the email title when user edit the title
  editingEmailTitle(){
    var elem = document.getElementById("emailTitle");

    elem.style.borderBottom = '1px solid #0B8B8C'
    $("#editTitleImage").attr('src', 'assets/icons/ic_editgreen.svg');
    $("#editTitleImage").attr('width', '15px');
  }

  editingEmailTitleBorder(action){
    var elem = document.getElementById("emailTitle");

    if(!elem.style.borderBottom.includes('1px solid')){
      if(action == "Show"){
        elem.style.borderBottom = '2px dashed #0B8B8C'
        $("#emailTitleEditButton").show();
      }else{
        elem.style.borderBottom = 'none'
        $("#emailTitleEditButton").hide();
      }  
    }
  }
  
  countEmailTitleCharacters(event){
    console.log(event);
    var length = event.target.innerText.length;
    if(length >= 31){
      document.getElementById("templateTitleText").innerText = this.emailTitle;
    }else{
      this.emailTitle = event.target.innerText
    }
  }
  onEnter($event) {
    console.log($event);
    //$event.preventDefault();
    var length = $event.target.innerText.length;
    if($event.key != 'Enter'){
      if(length >= 31 && $event.keyCode != 8){
        $event.preventDefault();
      }else{
        this.emailTitle = $event.target.innerText
      }
  }else{ 
     $event.preventDefault();
  }
  }

 
  editFocus(idType, tag) {
    // console.log("need to get focus on clicking pencil icon", tag, "column{{tag.tagId+tag.id}}", document.getElementById("column"+tag.tagId+tag.id));
    // event.stopPropagation();
    let divEl = document.getElementById(idType+tag.tagId);
  //   setTimeout(() => {
  //     divEl.click();
  //     divEl.focus();
  // }, 0);

    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(divEl.childNodes[0], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  //Saves the theme applied to the email
  async saveEmailTheme(theme){
    var emailCampaignDtl={
      id: localStorage.getItem("emailTemplateId"),
      emailTheme:{
        id:theme
      }
    } 
    var emailCampaign ={
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailCampaignDtl] 
    }
    var data: any = await this.service.createEmailCampaign(emailCampaign);
    console.log(data);
    if (data.status == 'SUCCESS') {
      this.emailCommonService.updateEmailTempelateData(data.data.emailCampaignDtl, 'Theme');
    } else {
      this.commonService.serverError(data);
    }

  }

  editEmailView: any = true;

  onNavigation(type) {
    if (type == 'changeEmailTemplate') {
      let sure = confirm("If you change the template then all of your changes will be erased");
        if(sure == true){
          $("#main .main-content").removeClass(this.emailTemplateName.templateName)
          localStorage.removeItem("templateData");
          this.router.navigate(['/emailTemplateSequance'])
        }
    }
  }

  async onEditEmail(event) {
    console.log(event)
    this.editEmailView = true;
    if (event == "startFromScratch") {
      this.emailCommonService.startFromScratchBCTemplate();
      await this.newTemplateInitialization(true);
    }else{
      this.emailCommonService.startFromScratchBCTemplate();
      this.emailTemplateName = event;
      console.log(this.emailTemplateName);
      await this.newTemplateInitialization(true);
    }
 
  }

  public moveBackgroundImageWithScroll(event) {
    if(this.emailTemplateName.templateName == 'template2'){
      var x = event.originalEvent.target.scrollTop;
      var y = -x;
      $('#main .template2').css('background-position','0% '+y+'px');
    }
  }

  // , 60, 72, 96 
  fontSizes: any = [
    10, 12, 14, 16, 18, 24, 30, 36,46, 48
  ]
  spacerTab(activeTab) {
    this.activeTab = activeTab;
    if ($('#swapp li.active') && $('#swapp li.active').hasClass('active')) {
      $('#swapp li.active').removeClass('active');
    }
    if(activeTab == 'sStyle'){
      $('#spacer_style').addClass('active');
    }else{
      $('#spacer_design').addClass('active');
    }
   
  }

  alignMenu(){
    console.log(document.getElementById("alignmentMenu"));
    var styl = document.getElementById("alignmentMenu");
    if(styl.style.display == 'none' || styl.style.display == ""){
      styl.style.display = 'block'
    }else{
      styl.style.display = 'none'
    }
  }

  dynamicValue:any = {}
  async openAddDynamicValuesModal(action){
    var modal = document.getElementById("addDynamicValue");
    await this.restoreSelection(this.selectionRange);
    if(modal.style.display == 'block'){
      modal.style.display = 'none';
      var sel, range;
    if (window.getSelection && (sel = window.getSelection()).rangeCount && action == 'Add') {
      console.log(sel);
      var savedDynamicValues:any = await this.saveDynamicValue();
      console.log(savedDynamicValues);
      if(sel.baseNode.parentNode.tagName == 'SPAN' && sel.baseNode.parentNode.id){
        if(sel.baseNode.parentNode.id.includes("dynamicValue")){
          console.log(sel.baseNode.parentNode)
          $(sel.baseNode.parentNode).remove();
        }
      }

        range = sel.getRangeAt(0);
        var span = document.createElement("span");
        span.className ="dynamicValue";
        span.style.cursor = "pointer"

        span.id = "dynamicValue"+savedDynamicValues.id;
        span.innerText = " ${"+this.dynamicValue.dynamicValue+"} ";
        range.deleteContents();
        console.log(range);
        range.insertNode(span);
    }
    }else{
      modal.style.display = 'block'; 
    }
  }
  async saveDynamicValue() : Promise<any>{
    var emailBodyDtl : any ={
      "id": this.tagBeingEdited.id,
      "dynamicValues" : [this.dynamicValue]
    }
    var emailTemplate: any = {
     id: localStorage.getItem("emailTemplateId"),
     emailBodyDtl : [emailBodyDtl]
    }
    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailTemplate]
    }
    console.log(emailCampaign);
    var data: any = await this.service.createEmailCampaign(emailCampaign);
    console.log(data);
    if (data.status == 'SUCCESS') {
      await this.emailCommonService.updateEmailTempelateDynamicVale(data.data.emailCampaignDtl.emailBodyDtl);
        //var newText = $('#text' + this.tagBeingEdited.tagId);
        // var dataDiv = $("#textDiv"+this.tagBeingEdited.tagId);
        //console.log(newText);  
         // this.tagBeingEdited.text = newText[0].innerHTML;
        //  this.tagBeingEdited.htmlText = newText[0].outerHTML;
      return data.data.emailCampaignDtl.emailBodyDtl[0].dynamicValues[0];
    } else {
      this.commonService.serverError(data);
      return null;
    }
  }
  editDynamicValue(target){
    console.log("Edit Dymanic value")
      console.log(this.tagBeingEdited);
    var el = document.getElementById(target.id);
    console.log(el);
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    console.log(sel);
    sel.removeAllRanges();
    sel.addRange(range);
    this.tagBeingEdited.dynamicValues.forEach( e=>{
      var dynamicValueId = "dynamicValue"+e.id;
        if(dynamicValueId == target.id){
          this.dynamicValue = e;
        }
    })
    var modal = document.getElementById("addDynamicValue");
    modal.style.display = 'block'
  }
  showColorPickerPosition(event){
      console.log(event);
      setTimeout(()=>{
        var colorPicker = $(".color-picker");
        if(colorPicker[0].offsetTop > 0){
          var newTop = Math.abs(event.screenY - colorPicker[0].offsetTop)
          console.log(newTop)
          var newTop2 = Math.abs(colorPicker[0].offsetTop - newTop);
          console.log(newTop2);
          $(".color-picker").css("top",newTop2+"px");
          $(".color-picker .arrow").css("top",(newTop+4)+"px");
        }else{
          var newTop = Math.abs(event.screenY - event.clientY)
          console.log(newTop)
          var newTop2 = Math.abs(event.clientY - newTop);
          console.log(newTop2);
          $(".color-picker").css("top",newTop2+"px");
          $(".color-picker .arrow").css("top",(newTop-10)+"px");
        }
        
      })
  }
  closingColorPicker(){
    var colorPicker = $(".color-picker");
    console.log(colorPicker[0].offsetTop);
  }

//converting svg image to png image
async saveDividerAsImage(){
  console.log(this.previouslySelectedTag);
  var data = $('#divider' + this.previouslySelectedTag.tagId);
  console.log(data);
  var oldElement = data[0].outerHTML;
  console.log(oldElement)
   await this.svgUrlToPng(this.previouslySelectedTag.tagId);
  // console.log(oldElement);
  // console.log($('#divider' + tag.tagId)[0].innerHTML);
}

 async  svgUrlToPng(dividerId){
  
  var svgImg = $("#divider"+dividerId+" .my-icon")
  console.log( $("#divider"+dividerId+" .my-icon"));
  var dividerImg = svgImg[0];
  console.log(svgImg);
    var x = $(dividerImg).children()[0]
   // x.style.stroke = this.previouslySelectedTag.style.stroke;
    // x.setAttribute( 'style', 'stroke: "'+this.previouslySelectedTag.style.stroke+' "'  );
    // console.log(x);
    const svg = x.outerHTML;
     const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const svgImage = document.createElement('img');
      let me = this;
      document.body.appendChild(svgImage);
      svgImage.onload = async function () {
          const canvas = document.createElement('canvas');
          canvas.width = svgImage.clientWidth;
          canvas.height = svgImage.clientHeight;
          const canvasCtx = canvas.getContext('2d');
          canvasCtx.drawImage(svgImage, 0, 0);
          const imgData = canvas.toDataURL('image/png');
         // const blobData = canvas.toBlob(me.convertToBlob);

         // callback(imgData);
          URL.revokeObjectURL(url);
          //var newDivider = Object.assign([], x);
          $("#divider"+dividerId).empty();
          await me.uploadDividerImage(imgData,"divider"+dividerId );

      };
      svgImage.setAttribute( 'style', 'visibility: hidden;' );
      svgImage.src = url;

 
 }
 async uploadDividerImage(image,dividerId) : Promise<void>{
  const imageBlob = this.dataURItoBlob(image);
  const imageFile = new File([imageBlob], 'dividerIcon', { type: 'image/jpeg' });
  let data: any = await this.fileUploadService.uploadOutcomeImageToAmazonServer(imageFile)
  console.log("Uploading image", data);
  if(data.status == 'SUCCESS'){
     const pngImage = document.createElement('img');
    pngImage.setAttribute( 'style', 'max-width: fit-content !important; height: auto !important;' );
    document.getElementById(dividerId).appendChild(pngImage);
    pngImage.src=data.message;
    console.log(pngImage)
    setTimeout(async () => {
      var dataXy = $('#' + dividerId);
      console.log(dataXy);
    var oldElement = dataXy[0].outerHTML;
    console.log(oldElement);
    this.previouslySelectedTag.htmlText = oldElement;
    var emailTemplate: any = {
      id: this.emailTemplate.id,
      emailBodyDtl: [this.previouslySelectedTag]
    }
    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: [emailTemplate]
    }
    var savedDivider: any = await this.service.createEmailCampaign(emailCampaign);
    if (savedDivider.status == 'SUCCESS') {
      this.previouslySelectedTag = {};
      await this.emailCommonService.updateEmailTempelate(savedDivider.data.emailCampaignDtl.emailBodyDtl);
      this.toggleToSBList();
    }else{
      this.commonService.serverError(savedDivider);
    }
    }, 200);
    
  }
 }
}