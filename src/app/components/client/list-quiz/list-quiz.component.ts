import { Component, OnInit } from '@angular/core';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { QuizSetupComponent } from '../../coach/quiz-setup/quiz-setup.component';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';
// import jquery
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-quiz',
  templateUrl: './list-quiz.component.html',
  styleUrls: ['./list-quiz.component.css']
})
export class ListQuizComponent implements OnInit {

  constructor(private quizAPI: QuizapiserviceService,private router: Router,
            private quizConf : QuizConfigureserviceService) { }
  quizList:any;
  quizId: any;
  displayedColumns: string[] = ['QuizTitle', 'Actions'];

  ngOnInit() {

   var dataQuiz : any =  this.quizAPI.getPublishedQuiz();
      console.log(dataQuiz);
      var quiz :any= dataQuiz;
      if(quiz.status == 'SUCCESS')
      {
        this.quizList = quiz.data;
        this.quizList.forEach(element =>{
            console.log(element.id);
        })
        Object.keys(localStorage)
          .forEach(function(k) {
            console.log(k);
            if(k != 'token' && k != 'currentUser') 
              localStorage.removeItem(k);
        });
        this.quizConf.setQuizList(this.quizList);
      }
      else if(quiz.status == 'ERROR')
      {
        //this.quizSetup.message = quiz.message;
        setTimeout(function() { $("#messageBox").fadeOut(); }, 1000);
        $("#messageBox").fadeIn();
        setTimeout(function() { $("#messageBox").fadeOut(); }, 1000);
      }


  }

  playQuiz(quizId){
    console.log(quizId);
    localStorage.setItem("quizId", quizId);
    this.router.navigate(['/PlayQuiz']);
  }

  editQuiz(quizId){
    console.log(quizId);
    Object.keys(localStorage)
      .forEach(function(k) {
        console.log(k);
        if(k != 'token' && k != 'currentUser') 
          localStorage.removeItem(k);
    });
    localStorage.setItem("quizId", quizId);
    localStorage.setItem("edit", "true");
    if (quizId) {

        this.router.navigate(['/quizSetup/WelcomePage']);
    }
  }

  newQuiz()
  {
    localStorage.removeItem("quizId");
    localStorage.removeItem("quizConfiguration");
    Object.keys(localStorage)
      .forEach(function(k) {
        console.log(k);
        if(k != 'token' && k != 'currentUser') 
          localStorage.removeItem(k);
    });
    localStorage.setItem("edit", "false");
    this.router.navigate(['/quizSetup/WelcomePage']);
  }
}
