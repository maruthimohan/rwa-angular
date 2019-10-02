import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, of, from} from 'rxjs';
import {map, catchError, debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import '../rxjs-extensions';

import {Question} from '../model/question';
import {Category} from '../model';
import {CategoryService} from './category.service';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";

@Injectable()
export class QuestionService {
    private _serviceUrl = 'http://localhost:3000/questions';  // URL to web api
    private readonly questions$: Observable<Question[]>;
    private questionsDB$: AngularFireList<Question>;

    constructor(private http: HttpClient,
                private categoryService: CategoryService,
                private db: AngularFireDatabase) {
        this.questionsDB$ = db.list<Question>('/questions');
        this.questions$ = this.questionsDB$.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => {
                    const question = c.payload.val();
                    question.key = c.payload.key;
                    return question;
                })
            )
        );
    }

    // getQuestions(): Observable<Question[]> {
    //     let url = this._serviceUrl;
    //     return this.http.get(url)
    //               .pipe(map(res => res as Question[]));
    // }

    getQuestions(): Observable<Question[]> {
        // const url = this._serviceUrl;
        // return forkJoin(
        //     this.http.get(url).pipe(map<any, Question[]>(res => res)),
        //     this.categoryService.getCategories()
        // )
        // .pipe(
        //     map((combined, index) => {
        //         const questions: Question[] = combined[0];
        //         const categories: Category[] = combined[1];
        //         questions.forEach(q => {
        //             q.categories = [];
        //             q.categoryIds.forEach(id => q.categories.push(categories.find(element => element.id === id)));
        //         });
        //         return questions;
        //     })
        // );

        // Return the Questions observable record
        // return this.http.get(url).pipe(map<any, Question[]>(res => res));

        // Fetch the Questions from the Angular Firebase Database
        return this.questions$;
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

    saveQuestion(question: Question): Observable<any> {
        const url = this._serviceUrl;

        // return this.http.post(url, question)
        //     .pipe(map(res => res as Question));

        // Push the new Question item to the list of Questions in the Database
        const newQuestionReference = this.questionsDB$.push(question);
        console.log('New Question Reference');
        console.log(newQuestionReference);

        return from(newQuestionReference);
    }

    updateQuestion(key: string, question: Question): Observable<any> {
        // const url = `${this._serviceUrl}/${question.id}`;

        // return this.http.put(url, question)
        //     .pipe(map(res => res as Question));

        // Update the question related to the key of the question
        return from(this.questionsDB$.update(key, question));
    }

    deleteQuestion(questionKey: string): Observable<any> {
        // const url = `${this._serviceUrl}/${questionId}`;

        // return this.http.delete(url);

        // Remove the element from the specified position in the Questions list from the store
        return from(this.questionsDB$.remove(questionKey));
    }

}
