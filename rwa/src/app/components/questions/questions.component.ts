import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

import {Category, Question} from '../../model';
import {QuestionService} from '../../services';
import {MatSnackBar} from '@angular/material';
import {CustomSnackBarComponent} from '../custom-snack-bar/custom-snack-bar.component';
import {AppStore} from '../../store/app-store';
import {select, Store} from '@ngrx/store';
import {QuestionActions} from '../../store/actions';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'question-list',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
    questions: Question[];
    categoriesDictionary: { [key: number]: Category } = {};
    store$: Observable<Question[]>;
    deleteStatus$: Observable<string>;
    categoriesDict$: Observable<{ [key: number]: Category }>;
    sub: any;

    constructor(private questionService: QuestionService,
                // tslint:disable-next-line:variable-name
                private _snack: MatSnackBar,
                private store: Store<AppStore>) {
        this.store$ = store.pipe(select(state => {
            return state.questions;
        }));
        this.deleteStatus$ = store.pipe(select(state => {
            return state.questionDeleteStatus;
        }));
        this.categoriesDict$ = store.pipe(select(state => {
            return state.categoriesDictionary;
        }));
    }

    ngOnInit() {
        // this.sub = this.questionService.getQuestions()
        //     .subscribe(questions => this.questions = questions);
        this.sub = this.store$.subscribe((questions) => {
            this.questions = questions;
            console.log('this.questions in questions component html');
            console.log(this.questions);
        });
        this.categoriesDict$.subscribe((dictionary) => {
            this.categoriesDictionary = dictionary;
            console.log('this.categoriesDictionary in questions component html');
            console.log(this.categoriesDictionary);
        });
    }

    deleteQuestion(questionId: string) {
        // Delete this question using the ID sent
        // this.questionService.deleteQuestion(questionId).subscribe(
        //     response => {
        //         console.log(`Response for the DELETE:`);
        //         console.log(response);
        //         console.log(`Question with Id ${questionId} has been deleted.`);
        //         this._snack.openFromComponent(CustomSnackBarComponent,
        //             {
        //                 data: `Question ${questionId} has been deleted!`,
        //                 duration: 2000
        //             }
        //         );
        //         // Open a subscription to fetch the updated list of question records from JSON file
        //         this.questionService.getQuestions()
        //             .subscribe(questions => this.questions = questions);
        //     }
        // );

        // Dispatch the delete intent through the Store
        this.store.dispatch(QuestionActions.deleteQuestion({questionId}));
        // Subscribe to the question delete status
        this.deleteStatus$.pipe(
            filter(status => status === 'SUCCESS')
        )
        .subscribe(
            () => {
                this._snack.openFromComponent(CustomSnackBarComponent,
                    {
                        data: `Question ${questionId} has been deleted!`,
                        duration: 2000
                    }
                );
            }
        );
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
