 import { EmailListComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-list/email-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Subscription } from 'rxjs'
import { NgAddToCalendarModule } from '@trademe/ng-add-to-calendar';

// ngx-chips
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

// color-picker
// import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerModule } from './custom-libs/ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizSetupComponent } from './components/coach/quiz-setup/quiz-setup.component';
import { ConfigureComponent } from './components/coach/quiz-setup/setup-options/configure/configure.component';
import { OutcomesComponent } from './components/coach/quiz-setup/setup-options/outcomes/outcomes.component';
import { QuestionsComponent } from './components/coach/quiz-setup/setup-options/questions/questions.component';
import { LeadCaptureComponent } from './components/coach/quiz-setup/setup-options/lead-capture/lead-capture.component';
import { TestQuizComponent } from './components/coach/quiz-setup/setup-options/test-quiz/test-quiz.component';
import { SettingsComponent } from './components/coach/quiz-setup/setup-options/settings/settings.component';
import { ScrollEventModule } from 'ngx-scroll-event';

import { DragDropModule} from '@angular/cdk/drag-drop';
// Common file for base URL
import { Common } from './services/global/common';

// file upload
import { ngfModule, ngf } from 'angular-file';

// http
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

// image cropper
import { ImageCropperModule } from 'ngx-image-cropper';

// image drag and drop
import { FileDropModule } from 'ngx-file-drop';

// Cookie Service
import { CookieService } from 'ngx-cookie-service';
import { MatVideoModule } from 'mat-video';

import { NgxUiLoaderModule, NgxUiLoaderConfig, NgxUiLoaderHttpModule , SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';

import { UploadFileComponent } from './components/global/upload-file/upload-file.component';
import { LoginComponent } from './components/global/login/login.component';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { RegistrationComponent } from './components/global/registration/registration.component';
import { LandingComponent } from './components/client/landing/landing.component';
import { ListQuizComponent } from './components/client/list-quiz/list-quiz.component';
import { ListWebinarComponent } from './components/client/list-webinar/list-webinar.component';
import { MatTableModule } from '@angular/material';
import { WebinarSetupComponent } from './components/coach/webinar-setup/webinar-setup.component';
import { WebinarInfoComponent } from './components/coach/webinar-setup/setup-options/webinar-info/webinar-info.component';
import { WebinarTypeComponent } from './components/coach/webinar-setup/setup-options/webinar-type/webinar-type.component';
import { OfferComponent } from './components/coach/webinar-setup/setup-options/offer/offer.component';
import { ChatBoxComponent } from './components/coach/webinar-setup/setup-options/chat-box/chat-box.component';
import { PresentationSlidesAndVideosComponent } from './components/coach/webinar-setup/setup-options/presentation-slides-and-videos/presentation-slides-and-videos.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafeHtmlPipe } from './components/coach/webinar-setup/setup-options/webinar-info/webinar-info.component';
import { SafeInnerHtmlPipe } from './pipes/safe-html';

// import { AngularEditorModule } from '@kolkov/angular-editor';

// import { NgxTinymceModule } from 'ngx-tinymce';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { WebinarRegistrationPageComponent } from './components/client/webinar/webinar-registration-page/webinar-registration-page.component';

import { ThankyouPreviewComponent } from './components/client/webinar/thankyou-preview/thankyou-preview.component';

import { AutoWebinarStremPageComponent } from './components/client/webinar/auto-webinar-strem-page/auto-webinar-strem-page.component';
import { EmbedVideo } from 'ngx-embed-video';
import { CountDownPageComponent } from './components/client/webinar/count-down-page/count-down-page.component';
import { LiveWebinarStreamPageComponent } from './components/client/webinar/live-webinar-stream-page/live-webinar-stream-page.component';
import { StreamPageComponent } from './components/client/webinar/stream-page/stream-page.component';
import { OpentokDemoComponent } from './components/client/webinar/opentok-demo/opentok-demo.component';
import { PublisherComponent } from './components/client/webinar/opentok-demo/publisher/publisher.component';
import { SubscriberComponent } from './components/client/webinar/opentok-demo/subscriber/subscriber.component';

import { OpentokService } from './components/client/webinar/opentok-demo/opentok.service';
import { MomentModule } from 'ngx-moment';
import { EndWebinarComponent } from './components/client/webinar/end-webinar/end-webinar.component';
import { MarketingSetupComponent } from './components/coach/dashboard/marketing-setup/marketing-setup.component';
import { FunnelsComponent } from './components/coach/dashboard/marketing-setup/funnels/funnels.component';
import { FunnelsListComponent } from './components/coach/dashboard/marketing-setup/funnels/funnels-list/funnels-list.component';
import { FunnelTypesComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-types/funnel-types.component';
import { DashboardComponent } from './components/coach/dashboard/dashboard.component';
import { FunnelFragmentsComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/funnel-fragments.component';
import { RegistrationPageComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/registration-page/registration-page.component';
import { EmailsComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/emails/emails.component';
import { FunnelFragmentsHostDirective } from './directives/funnel-fragments-host.directive';
import { FunnelCreateComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-create/funnel-create.component';
import { HeaderComponent } from './components/global/header/header.component';
import { WelcomePageComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/welcome-page/welcome-page.component';
import { WebinarPageComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/webinar-page/webinar-page.component';
import { QuizPageComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-fragments/quiz-page/quiz-page.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownComponent } from './components/global/dropdown/dropdown.component';
import { AutomationRulesComponent } from './components/global/automation-rules/automation-rules.component';
import { MessagePopupComponent } from './components/global/message-popup/message-popup.component';
import { IntegrationsComponent } from './components/coach/quiz-setup/setup-options/settings/integrations/integrations.component';
import { MetaDataComponent } from './components/coach/quiz-setup/setup-options/settings/meta-data/meta-data.component';
import { ErrorPageComponent } from './components/global/error-page/error-page.component';
import { QuizDesignComponent } from './components/coach/quiz-setup/setup-options/quiz-design/quiz-design.component';

import { EmailCampaignsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-campaigns.component';
import { ComponentBuildersHostDirective } from './directives/component-builders-host.directive';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSortableModule } from 'ngx-sortable';
// pipes 
// safe html
//import { SafeInnerHtmlPipe } from './pipes/safe-html';
import { ContetComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/contet/contet.component';
 
import { EditEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/edit-email/edit-email.component';
import { EmailSequenceComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-sequence/email-sequence.component';
import { EmailSequenceBlueprintsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-sequence-blueprints/email-sequence-blueprints.component';
import { EmailPreviewComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-preview/email-preview.component';
import { EmailCampaignListComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-campaign-list/email-campaign-list.component';
import { QuillModule } from 'ngx-quill'
import { EmailTemplateSequanceComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-template-sequance/email-template-sequance.component';
import { EmailBroadcastOneComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-broadcast-one/email-broadcast-one.component';
// pipes 
// safe html
//import { SafeInnerHtmlPipe } from './pipes/safe-html';
//For tool tip
import { TooltipModule } from 'ng2-tooltip-directive';
import { CommonEmailTempatesComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/common-email-tempates/common-email-tempates.component';
import { SubscribeToEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/subscribe-to-email/subscribe-to-email.component';
import { UnsubscribeToEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/unsubscribe-to-email/unsubscribe-to-email.component';
import { SuccessfullyUnsubscribedComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/successfully-unsubscribed/successfully-unsubscribed.component';
import { ChangeSubscriberDetailsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/change-subscriber-details/change-subscriber-details.component';
import { InlineSVGModule } from 'ng-inline-svg';
/*[[social login related code]]*/

// Import angular-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';
 
// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { CrmComponent } from './components/coach/dashboard/crm/crm.component';
import { ContactsComponent } from './components/coach/dashboard/crm/contacts/contacts.component';
import { UploadContactListComponent } from './components/coach/dashboard/crm/upload-contact-list/upload-contact-list.component';
import { SegmentsComponent } from './components/coach/dashboard/crm/segments/segments.component';
import { SegmentDetailComponent } from './components/coach/dashboard/crm/segment-detail/segment-detail.component';
import { TagsComponent } from './components/coach/dashboard/crm/tags/tags.component';
import { FieldsComponent } from './components/coach/dashboard/crm/fields/fields.component';
import { BulkOperationsComponent } from './components/coach/dashboard/crm/bulk-operations/bulk-operations.component';
import { AddBulkOperationComponent } from './components/coach/dashboard/crm/add-bulk-operation/add-bulk-operation.component';
import { SegmentationRuleComponent } from './components/global/segmentation-rule/segmentation-rule.component';
import { PruningOperationComponent } from './components/coach/dashboard/crm/pruning-operation/pruning-operation.component';
import { AddPruningOperationComponent } from './components/coach/dashboard/crm/add-pruning-operation/add-pruning-operation.component';
import { RecepientDetailsComponent } from './components/coach/recepient-details/recepient-details.component';
// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('647129437466-0rp2359nmcpikfkls8oqsm2uj0teh6tg.apps.googleusercontent.com')
  },
  {
    // TODO: CHANGE THE FACEBOOK-APP-ID TO BE FROM ZUUBA ACCOUNT'S
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('420363038543010')
  }
]);

export function provideConfig() {
  return config;
}
/*[[end of social login related code]]*/

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

TagInputModule.withDefaults({
  tagInput: {
      placeholder: 'Add new tag'
  }
});

@NgModule({
  declarations: [
    AppComponent,
    QuizSetupComponent,
    ConfigureComponent,
    OutcomesComponent,
    QuestionsComponent,
    LeadCaptureComponent,
    TestQuizComponent,
    SettingsComponent,
    UploadFileComponent,
    LoginComponent,
    RegistrationComponent,
    LandingComponent,
    ListQuizComponent,
    ListWebinarComponent,
    WebinarSetupComponent,
    WebinarInfoComponent,
    WebinarTypeComponent,
    OfferComponent,
    ChatBoxComponent,
    PresentationSlidesAndVideosComponent,
    WebinarRegistrationPageComponent,
    AutoWebinarStremPageComponent,
    CountDownPageComponent,
    LiveWebinarStreamPageComponent,

    ThankyouPreviewComponent,
    AutoWebinarStremPageComponent,
    SafeHtmlPipe,
    SafeInnerHtmlPipe,
    StreamPageComponent,
    OpentokDemoComponent,
    PublisherComponent,
    SubscriberComponent,
    EndWebinarComponent,
    MarketingSetupComponent,
    FunnelsComponent,
    FunnelsListComponent,
    FunnelTypesComponent,
    DashboardComponent,
    FunnelFragmentsComponent,
    RegistrationPageComponent,
    EmailsComponent,
    FunnelFragmentsHostDirective,
    FunnelCreateComponent,
    HeaderComponent,
    WelcomePageComponent,
    WebinarPageComponent,
    QuizPageComponent,
    DropdownComponent,
    AutomationRulesComponent,
    MessagePopupComponent,
    IntegrationsComponent,
    MetaDataComponent,
    ErrorPageComponent,
    MetaDataComponent,
    QuizDesignComponent,
    EmailCampaignsComponent,
    ComponentBuildersHostDirective,
    EmailListComponent,
    ContetComponent,
    EditEmailComponent,
    EmailSequenceComponent,
    EmailSequenceBlueprintsComponent,
    EmailPreviewComponent,
    EmailCampaignListComponent,
    EmailTemplateSequanceComponent,
    EmailBroadcastOneComponent,
    CommonEmailTempatesComponent,
    SubscribeToEmailComponent,
    UnsubscribeToEmailComponent,
    SuccessfullyUnsubscribedComponent,
    ChangeSubscriberDetailsComponent,
    CrmComponent,
    ContactsComponent,
    UploadContactListComponent,
    SegmentsComponent,
    SegmentDetailComponent,
    TagsComponent,
    FieldsComponent,
    BulkOperationsComponent,
    AddBulkOperationComponent,
    SegmentationRuleComponent,
    PruningOperationComponent,
    AddPruningOperationComponent,
    RecepientDetailsComponent,
    //SafeInnerHtmlPipe
   ],
  imports: [
    HttpClientModule,
    InlineSVGModule.forRoot(),
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    ngfModule,
    ImageCropperModule,
    FileDropModule,
    ColorPickerModule,
    MatVideoModule,
    ScrollEventModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true, exclude: ['https://18.220.96.170:8443/webinar/saveMessage', 'https://18.220.96.170:8443/webinar/likeMessage', 'https://18.220.96.170:8443/emailCampaign/saveEmailCampaign'] }),
   SocialLoginModule,
    MatTableModule,
    DragDropModule,
    EmbedVideo.forRoot(),
    MomentModule,
    QuillModule.forRoot(),
    PdfViewerModule,
    NgAddToCalendarModule,
    NgxUiLoaderModule,
    Ng5SliderModule,
    TooltipModule ,
    NgxSortableModule,
    FusionChartsModule,
  ],
  exports: [],
  providers: [
        CookieService,

        Common,
        {
          provide: AuthServiceConfig,
          useFactory: provideConfig
        },
        OpentokService
      ],
  entryComponents: [WelcomePageComponent, RegistrationPageComponent, EmailsComponent, WebinarPageComponent, QuizPageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
