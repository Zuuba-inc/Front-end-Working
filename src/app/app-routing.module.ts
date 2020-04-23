import { EmailBroadcastOneComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-broadcast-one/email-broadcast-one.component';
import{EmailTemplateSequanceComponent}from './components/coach/dashboard/marketing-setup/email-campaigns/email-template-sequance/email-template-sequance.component';
import { EmailSequenceBlueprintsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-sequence-blueprints/email-sequence-blueprints.component';
import { EmailSequenceComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-sequence/email-sequence.component';
import { EmailListComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-list/email-list.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizSetupComponent } from './components/coach/quiz-setup/quiz-setup.component';

// import quiz setup options components
import { ConfigureComponent } from './components/coach/quiz-setup/setup-options/configure/configure.component';
import { OutcomesComponent } from './components/coach/quiz-setup/setup-options/outcomes/outcomes.component';
import { QuestionsComponent } from './components/coach/quiz-setup/setup-options/questions/questions.component';
import { LeadCaptureComponent } from './components/coach/quiz-setup/setup-options/lead-capture/lead-capture.component';
import { TestQuizComponent } from './components/coach/quiz-setup/setup-options/test-quiz/test-quiz.component';
import { SettingsComponent } from './components/coach/quiz-setup/setup-options/settings/settings.component';
import { LoginComponent } from './components/global/login/login.component';
import { RegistrationComponent } from './components/global/registration/registration.component';
import { LandingComponent } from './components/client/landing/landing.component';
import { ListQuizComponent } from './components/client/list-quiz/list-quiz.component';
import { ListWebinarComponent } from './components/client/list-webinar/list-webinar.component';

// import webinar setup options components
import { WebinarInfoComponent } from './components/coach/webinar-setup/setup-options/webinar-info/webinar-info.component';
import { WebinarTypeComponent } from './components/coach/webinar-setup/setup-options/webinar-type/webinar-type.component';
import { OfferComponent } from './components/coach/webinar-setup/setup-options/offer/offer.component';
import { ChatBoxComponent } from './components/coach/webinar-setup/setup-options/chat-box/chat-box.component';
import { PresentationSlidesAndVideosComponent } from './components/coach/webinar-setup/setup-options/presentation-slides-and-videos/presentation-slides-and-videos.component';
import { WebinarSetupComponent } from './components/coach/webinar-setup/webinar-setup.component'

// import view webinar components
import { WebinarRegistrationPageComponent } from './components/client/webinar/webinar-registration-page/webinar-registration-page.component';
import { ThankyouPreviewComponent } from './components/client/webinar/thankyou-preview/thankyou-preview.component';
import { AutoWebinarStremPageComponent } from './components/client/webinar/auto-webinar-strem-page/auto-webinar-strem-page.component';
import { CountDownPageComponent } from './components/client/webinar/count-down-page/count-down-page.component';
import { LiveWebinarStreamPageComponent } from './components/client/webinar/live-webinar-stream-page/live-webinar-stream-page.component';
import { StreamPageComponent } from './components/client/webinar/stream-page/stream-page.component';

import { OpentokDemoComponent } from './components/client/webinar/opentok-demo/opentok-demo.component';
import { EndWebinarComponent } from './components/client/webinar/end-webinar/end-webinar.component';

import { MarketingSetupComponent } from './components/coach/dashboard/marketing-setup/marketing-setup.component';
import { FunnelsComponent } from './components/coach/dashboard/marketing-setup/funnels/funnels.component';
import { EmailCampaignsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-campaigns.component';

import { FunnelsListComponent } from './components/coach/dashboard/marketing-setup/funnels/funnels-list/funnels-list.component';
import { FunnelTypesComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-types/funnel-types.component';
import { FunnelCreateComponent } from './components/coach/dashboard/marketing-setup/funnels/funnel-create/funnel-create.component';
import{ContetComponent} from './components/coach/dashboard/marketing-setup/email-campaigns/contet/contet.component';
// coach dashboard components
import { DashboardComponent } from './components/coach/dashboard/dashboard.component';

// settings module import 
import { MetaDataComponent } from './components/coach/quiz-setup/setup-options/settings/meta-data/meta-data.component';
import { IntegrationsComponent } from './components/coach/quiz-setup/setup-options/settings/integrations/integrations.component';
import { ErrorPageComponent } from './components/global/error-page/error-page.component';
import { QuizDesignComponent } from './components/coach/quiz-setup/setup-options/quiz-design/quiz-design.component';
import { EditEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/edit-email/edit-email.component';
import { EmailPreviewComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-preview/email-preview.component';
import { EmailCampaignListComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/email-campaign-list/email-campaign-list.component';
import { SubscribeToEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/subscribe-to-email/subscribe-to-email.component';
import { UnsubscribeToEmailComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/unsubscribe-to-email/unsubscribe-to-email.component';
import { SuccessfullyUnsubscribedComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/successfully-unsubscribed/successfully-unsubscribed.component';
import { ChangeSubscriberDetailsComponent } from './components/coach/dashboard/marketing-setup/email-campaigns/change-subscriber-details/change-subscriber-details.component';
import { CrmComponent } from './components/coach/dashboard/crm/crm.component';
import { ContactsComponent } from './components/coach/dashboard/crm/contacts/contacts.component';
import { UploadContactListComponent } from './components/coach/dashboard/crm/upload-contact-list/upload-contact-list.component';
import { SegmentsComponent } from './components/coach/dashboard/crm/segments/segments.component';
import { SegmentDetailComponent } from './components/coach/dashboard/crm/segment-detail/segment-detail.component';
import { TagsComponent } from './components/coach/dashboard/crm/tags/tags.component';
import { FieldsComponent } from './components/coach/dashboard/crm/fields/fields.component';
import { BulkOperationsComponent } from './components/coach/dashboard/crm/bulk-operations/bulk-operations.component';
import { AddBulkOperationComponent } from './components/coach/dashboard/crm/add-bulk-operation/add-bulk-operation.component';
import { PruningOperationComponent } from './components/coach/dashboard/crm/pruning-operation/pruning-operation.component';
import { AddPruningOperationComponent } from './components/coach/dashboard/crm/add-pruning-operation/add-pruning-operation.component';
import { RecepientDetailsComponent } from './components/coach/recepient-details/recepient-details.component';

const routes: Routes = [
  {
    path: 'content',
    component: ContetComponent,
  },
  {
    path: 'quizSetup',
    component: QuizSetupComponent,
    children: [
      { path: 'WelcomePage', component: ConfigureComponent, },
      // { path: 'Configure/:id', component:  ConfigureComponent },
      { path: 'Outcomes', component: OutcomesComponent },
      // { path: 'Outcomes/:id', component:  OutcomesComponent },
      { path: 'Questions', component: QuestionsComponent },
      // { path: 'Questions/:id', component:  QuestionsComponent },
      { path: 'LeadCapture', component: LeadCaptureComponent },
      // { path: 'LeadCapture/:id', component:  LeadCaptureComponent },
      { path: 'QuizDesign', component: QuizDesignComponent },
      {
        path: 'Settings',
        component: SettingsComponent,
        children: [
          {
            path: 'SEOMetaData',
            component: MetaDataComponent
          },
          {
            path: 'Integrations',
            component: IntegrationsComponent
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'SEOMetaData'
          }
        ]
      }
    ]
  },
  {
    path: 'webinarSetup',
    component: WebinarSetupComponent,
    children: [
      { path: 'WebinarInfo', component: WebinarInfoComponent, },
      { path: 'WebinarType', component: WebinarTypeComponent, },
      { path: 'WebinarType/live', component: WebinarTypeComponent, },
      { path: 'WebinarType/auto', component: WebinarTypeComponent, },
      { path: 'Offer', component: OfferComponent, },
      { path: 'ChatBox', component: ChatBoxComponent, },
      // { path: 'PresentationSlidesAndVideos', component:  PresentationSlidesAndVideosComponent,  },
      { path: 'PresentationVideo', component: PresentationSlidesAndVideosComponent }
    ]
  },
  {
    path: 'marketingSetup',
    component: MarketingSetupComponent,
    children: [
      {
        path: 'funnels',
        component: FunnelsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list'
          },
          {
            path: 'types',
            component: FunnelTypesComponent,
          },
          {
            path: 'list',
            component: FunnelsListComponent,
          }
        ]
      }
      ,
      {
        path: 'emailCampaigns',
        component: EmailCampaignsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list'
          },

          {
            path: 'list',
            component: EmailCampaignListComponent,
          }
        ]
      }
    ]
  },
  {
    path: 'crm', 
    component: CrmComponent, 
    children: [
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'segments',
        component: SegmentsComponent,
      },
      {
        path: 'tags',
        component: TagsComponent,
      },
      {
        path: 'fields',
        component: FieldsComponent,
      },
      {
        path: 'bulkOperations',
        component: BulkOperationsComponent
      },
      {
        path: 'pruningOperation',
        component: PruningOperationComponent
      }
    ]
  },
  {
    path: 'addPruningOperation',
    component: AddPruningOperationComponent
  },
  {
    path: 'addNewBulkOperation',
    component: AddBulkOperationComponent
  },
  {
    path: 'uploadlistofUser',
    component: UploadContactListComponent,
  },
  {
    path: 'segmentDetails',
    component: SegmentDetailComponent
  },
  {
    path: 'editEmail',
    component: EditEmailComponent,
  },
  {
    path: 'emailList',
    component: EmailListComponent,
  },
    {
      path: 'emailSequence',
      component: EmailSequenceComponent,
    },
    {
      path: 'emailBlueprints',
      component: EmailSequenceBlueprintsComponent,
    },
    {
     path: 'emailTemplateSequance',
     component:EmailTemplateSequanceComponent,
     },
     { 
      path: 'EmailBroadcastOne',
      component:  EmailBroadcastOneComponent 
     },
     { 
      path: 'subscribeToEmail',
      component:  SubscribeToEmailComponent 
     },
     {
      path: 'changeSubscriberDetails',
      component:ChangeSubscriberDetailsComponent
    },
     { 
      path: 'unsubscribeToEmail',
      component:  UnsubscribeToEmailComponent 
     },
     {
       path: 'sucessfullyUnsubscribed',
       component:SuccessfullyUnsubscribedComponent
     },

  {
    path: 'preview',
    component: EmailPreviewComponent
  },
  {
    path: 'funnelCreate/:funnelType',
    component: FunnelCreateComponent
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'quizSetup/TestQuiz', redirectTo: 'TestQuiz', pathMatch: 'full' },
  { path: 'TestQuiz', component: TestQuizComponent },
  { path: 'PlayQuiz', component: TestQuizComponent },
  { path: 'Registration', component: RegistrationComponent },
  { path: 'Landing', component: LandingComponent },
  { path: 'QuizList', component: ListQuizComponent },
  { path: 'WebinarList', component: ListWebinarComponent },
  { path: 'registerForWebinar', component: WebinarRegistrationPageComponent },
  { path: 'webinarAutoStreamPage', component: AutoWebinarStremPageComponent },
  { path: 'countDownPage', component: CountDownPageComponent },
  { path: 'liveWebinarPage', component: LiveWebinarStreamPageComponent },

  { path: 'thankyou', component: ThankyouPreviewComponent },
  { path: 'StreamPage', component: StreamPageComponent },
  { path: 'OpentokDemo', component: OpentokDemoComponent },
  { path: 'endWebinar', component: EndWebinarComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path : 'recepientDetails', component: RecepientDetailsComponent },
  // { path: 'crm', component: CrmComponent },
  { path: 'errorPage', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
