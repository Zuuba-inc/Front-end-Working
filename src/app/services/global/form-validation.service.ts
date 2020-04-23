import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  quizOutcome: any;

  quizQuestion: any;

  quizConfiguration: any;

  counter: any = 0;

  edit: any;

  setQuizFormStatus(quizConfiguration: any, module?: any) {

    // TODO: on page referesh, get quiz = conf obj from sessionStorage

    // for editing quiz, used this variable to avoid delay in validation update
    this.edit = sessionStorage.getItem("edit");

    if (quizConfiguration) {

      // if user opens outcomes module without entering text in configure, set invalid status
      if (module == "Configure" && this.edit != "true") {
        //  && sessionStorage.getItem("configureKeyup") != "True") {
        // set other modules status to ""
        sessionStorage.setItem("Configure", "");
        sessionStorage.setItem("Outcomes", "");
        sessionStorage.setItem("Questions", "");
        sessionStorage.setItem("Lead Capture", "");
      }

      // if user opens outcomes module without entering text in configure, set invalid status
      if (module == "Lead Capture" && this.edit != "true") {
        //  && (sessionStorage.getItem("configureKeyup") != "True"
        // || sessionStorage.getItem("outcomesKeyup") != "True" || sessionStorage.getItem("questionsKeyup") != "True")) {
        sessionStorage.setItem("Configure", "INVALID");
        sessionStorage.setItem("Outcomes", "INVALID");
        sessionStorage.setItem("Questions", "INVALID");
        sessionStorage.setItem("Lead Capture", "");
      }

      // if user opens outcomes module without entering text in configure, set invalid status
      if (module == "Outcomes" && this.edit != "true") {
        // && sessionStorage.getItem("configureKeyup") != "True"
        sessionStorage.setItem("Configure", "INVALID");

        // set other modules status to ""
        sessionStorage.setItem("Outcomes", "");
        sessionStorage.setItem("Questions", "");
        sessionStorage.setItem("Lead Capture", "");
      }

      // if user opens questiona module without entering text in other modules above questions, set invalid status
      if (module == "Questions" && this.edit != "true") {
        //  && (sessionStorage.getItem("configureKeyup") != "True"
        // || sessionStorage.getItem("outcomesKeyup") != "True")) {
        sessionStorage.setItem("Configure", "INVALID");
        sessionStorage.setItem("Outcomes", "INVALID");
        sessionStorage.setItem("Questions", "");
        sessionStorage.setItem("Lead Capture", "");
      }

      if (module == "Settings" && this.edit != "true") {
        //  && (sessionStorage.getItem("configureKeyup") != "True"
        // || sessionStorage.getItem("outcomesKeyup") != "True" || sessionStorage.getItem("questionsKeyup") != "True"
        // || sessionStorage.getItem("leadCaptureKeyup") != "True")) {
        sessionStorage.setItem("Configure", "INVALID");
        sessionStorage.setItem("Outcomes", "INVALID");
        sessionStorage.setItem("Questions", "INVALID");
        sessionStorage.setItem("Lead Capture", "INVALID");
      }

      // set status for configure
      if (sessionStorage.getItem("configureKeyup") == "True") {
        if (!quizConfiguration.quizTitle ||
          !quizConfiguration.quizDescription ||
          !quizConfiguration.quizCallActionLabel) {
          sessionStorage.setItem("Configure", "INVALID");
        } else {
          sessionStorage.setItem("Configure", "VALID");
        }
      }

      // set status for lead capture
      if (sessionStorage.getItem("leadCaptureKeyup") == "True") {
        if (quizConfiguration.quizLeadCaptureInfo && ((quizConfiguration.quizLeadCaptureInfo.headline == null
          || quizConfiguration.quizLeadCaptureInfo.callActionLabel == null 
          || quizConfiguration.quizLeadCaptureInfo.headlineDesc == null ) &&
          (quizConfiguration.quizLeadCaptureInfo.headline != "" &&
          quizConfiguration.quizLeadCaptureInfo.headlineDesc != "" &&
          quizConfiguration.quizLeadCaptureInfo.callActionLabel != ""))) {
          sessionStorage.setItem("Lead Capture", "INVALID");
        }else {
          if (quizConfiguration.quizLeadCaptureInfo && quizConfiguration.quizLeadCaptureInfo.headline &&
            quizConfiguration.quizLeadCaptureInfo.headlineDesc &&
            quizConfiguration.quizLeadCaptureInfo.callActionLabel) {
            sessionStorage.setItem("Lead Capture", "VALID");
          }
        }
      }

      // set status for outcomes
      if (sessionStorage.getItem("outcomesKeyup") == "True") {

        // get latest quiz outcome changes made and set validation based on that
        this.quizConfiguration = JSON.parse(sessionStorage.getItem("quizConfiguration"));

        if (this.quizConfiguration) {
        // iterate over questions and set status
        if(this.quizConfiguration.quizOutcomes != undefined || this.quizConfiguration.quizOutcomes != null){
          for (let i = 0; i < this.quizConfiguration.quizOutcomes.length; i++) {
            // get latest quiz outcome changes made and set validation based on that
            this.quizOutcome = this.quizConfiguration.quizOutcomes[i];

            if (!this.quizOutcome.offerCallActionLabel ||
              !this.quizOutcome.offerDescription ||
              !this.quizOutcome.offerHeadline ||
              !this.quizOutcome.outcomeDescription ||
              !this.quizOutcome.outcomeTitle) {
              sessionStorage.setItem("Outcomes", "INVALID");
            } else {
              if (this.quizOutcome.offerCallActionLabel &&
                this.quizOutcome.offerDescription &&
                this.quizOutcome.offerHeadline &&
                this.quizOutcome.outcomeDescription &&
                this.quizOutcome.outcomeTitle) {
                sessionStorage.setItem("Outcomes", "VALID");
              }
            }
          }
        }
      }
      }

      // set status for questions
      if (sessionStorage.getItem("questionsKeyup") == "True") {

        // get latest quiz outcome changes made and set validation based on that
        this.quizConfiguration = JSON.parse(sessionStorage.getItem("quizConfiguration"));

        // iterate over questions and set status
        for (let i = 0; i < this.quizConfiguration.quizQuestions.length; i++) {
          this.quizQuestion = this.quizConfiguration.quizQuestions[i];

          if (!this.quizQuestion.questionDescription || this.quizQuestion.quizAnswers.length < 1) {
            sessionStorage.setItem("Questions", "INVALID");
          } else {
            if (this.quizQuestion.questionDescription && this.quizQuestion.quizAnswers.length >= 1) {

              this.quizQuestion.quizAnswers.forEach(element => {

                if (element.logicBranch == null || element.outcome == null) {
                  this.counter++;
                } else {
                  this.counter = 0;
                }
              });

              if (this.counter > 0) {
                sessionStorage.setItem("Questions", "INVALID");
              } else {
                sessionStorage.setItem("Questions", "VALID");
              }
            }
          }
        }
      }

      // set status for settings
      // if (quizConfiguration.quizSEOMetadata) {
      //   if (!quizConfiguration.quizSEOMetaseoMetaTitle ||
      //     !quizConfiguration.quizSEOMetaseoMetaDesc ||
      //     !quizConfiguration.quizSEOMetaseoImage) {
      //     sessionStorage.setItem("Settings", "INVALID");
      //   } else {
      //     sessionStorage.setItem("Settings", "VALID");
      //   }
      // } else {
      //   sessionStorage.setItem("Settings", "INVALID");
      // }

      // if user opens outcomes module without entering text in configure, set invalid status
      // if (module == "Settings" && sessionStorage.getItem("configureKeyup") != "True"
      //   && sessionStorage.getItem("outcomesKeyup") != "True" && sessionStorage.getItem("questionsKeyup") != "True"
      //   && sessionStorage.getItem("leadCaptureKeyup") != "True") {
      //   sessionStorage.setItem("Configure", "INVALID");
      //   sessionStorage.setItem("Outcomes", "INVALID");
      //   sessionStorage.setItem("Questions", "INVALID");
      //   sessionStorage.setItem("Lead Capture", "INVALID");
      // }
    }
  }
}
