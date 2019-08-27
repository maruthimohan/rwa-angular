import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Question } from '../../model';
import { QuestionService } from '../../services';
import { MatSnackBar } from '@angular/material';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  questions: Question[];
  sub: any;

  constructor(private questionService: QuestionService,
              private _snack: MatSnackBar) {
  }

  ngOnInit() {
    this.sub = this.questionService.getQuestions()
                   .subscribe(questions => this.questions = questions);
  }

  deleteQuestion(questionId: string) {
    // Delete this question using the ID sent
    this.questionService.deleteQuestion(questionId).subscribe(
      response => {
        console.log(`Question with Id ${questionId} has been deleted.`);
        this._snack.openFromComponent(CustomSnackBarComponent,
            {
              data : `Question ${questionId} has been deleted!`,
              duration: 2000
            }
        );
        // Open a subscription to fetch the updated list of question records from JSON file
        this.questionService.getQuestions()
                   .subscribe(questions => this.questions = questions);
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
