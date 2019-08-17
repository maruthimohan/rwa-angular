import { Injectable }    from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import '../rxjs-extensions';

import { Question } from '../model/question';
import { Category } from '../model';
import { CategoryService } from './category.service';

@Injectable()
export class QuestionService {
  private _serviceUrl = 'http://localhost:3000/questions';  // URL to web api

  constructor(private http: HttpClient,
              private categoryService: CategoryService) {
  }

  // getQuestions(): Observable<Question[]> {
  //     let url = this._serviceUrl;
  //     return this.http.get(url)
  //               .pipe(map(res => res as Question[]));
  // }

  getQuestions(): Observable<Question[]> {
    const url = this._serviceUrl;
    return forkJoin(
      this.http.get(url).pipe(map<any, Question[]>(res => res)),
      this.categoryService.getCategories())
      .pipe(
        map((combined, index) => {
          const questions: Question[] = combined[0];
          const categories: Category[] = combined[1];
          questions.forEach(q => {
            q.categories = [];
            q.categoryIds.forEach(id => q.categories.push(categories.find(element => element.id === id)));
          });
          return questions;
        })
      );
  }

  getQuestion(questionID: string): Observable<Question> {
    const url = `${this._serviceUrl}/${questionID}`;
    return forkJoin(
      {
        question: this.http.get(url).pipe(map(res => res as Question)),
        categories: this.categoryService.getCategories()
      }
    ).pipe(
      map(
        res => {
          const question = res.question;
          question.categories = [];
          question.categoryIds.forEach(
            id => {
              question.categories.push(
                res.categories.find(
                    element => element.id === id
                )
              );
            }
          );
          return question;
        }
      )
    );
  }

  saveQuestion(question: Question): Observable<Question> {
    const url = this._serviceUrl;

    return this.http.post(url, question)
                .pipe(map(res => res as Question));
  }

  updateQuestion(question: Question): Observable<Question> {
    const url = `${this._serviceUrl}/${question.id}`;

    return this.http.put(url, question)
                .pipe(map(res => res as Question));
  }

}
