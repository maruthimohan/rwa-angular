import {Actions, createEffect, ofType} from '@ngrx/effects';
import {QuestionService} from '../../services';
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {QuestionActions} from '../actions';
import {Question} from '../../model';
import {Action} from '@ngrx/store';

@Injectable()
export class QuestionEffects {

    constructor(
        private actions$: Actions,
        private questionService: QuestionService
    ) {}

    loadQuestions$ = createEffect(() => this.actions$.pipe(
            ofType(QuestionActions.loadQuestions),
            mergeMap(() => this.questionService.getQuestions()
                .pipe(
                    map((questions) => QuestionActions.loadQuestionsSuccess({questions})),
                    catchError(() => EMPTY)
                )
            )
        )
    );

    addQuestion$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(QuestionActions.addQuestion),
            mergeMap(( questionToCreate) => {
                    return this.questionService.saveQuestion(questionToCreate.question)
                        .pipe(
                            map(() => {
                                    // // Set the received ID to the question object
                                    // const questionAdded: Question = questionToCreate.question;
                                    // questionAdded.id = question.id;
                                    // // Generate new question added event with Question to add event
                                    return QuestionActions.addQuestionSuccess();
                                }
                            ),
                            catchError(() => EMPTY)
                        );
                }
            )
        );
    });

    updateQuestion$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(QuestionActions.updateQuestion),
                mergeMap((updateQuestionPayload) => {
                    return this.questionService.updateQuestion(updateQuestionPayload.key, updateQuestionPayload.questionObject)
                        .pipe(
                            map(() => {
                                return QuestionActions.updateQuestionSuccess();
                            }),
                            catchError(() => EMPTY)
                        );
                })
            );
        }
    );

    deleteQuestion$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(QuestionActions.deleteQuestion),
                mergeMap((actionPayload) => {
                    return this.questionService.deleteQuestion(`${actionPayload.questionId}`)
                        .pipe(
                            map(() => {
                                return QuestionActions.deleteQuestionSuccess({ questionId: actionPayload.questionId });
                                }
                            ),
                            catchError(() => EMPTY)
                        );
                })
            );
        }
    );
}
