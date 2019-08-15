import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Question } from '../../model';
import { QuestionService } from '../../services';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  questions: Question[];
  sub: any;

  constructor(private questionService: QuestionService) {
  }

  ngOnInit() {
    this.sub = this.questionService.getQuestions()
                   .subscribe(questions => this.questions = questions);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
