import {Question} from '../../model';
import {Action, createReducer, on} from '@ngrx/store';
import {QuestionActions} from '../actions';
import * as _ from 'lodash';

const initialStateQuestions: Question[] = [];
const initialStateQuestion: Question = new Question();

export const questionReducer = createReducer(
    initialStateQuestions,
    on(
        QuestionActions.loadQuestionsSuccess,
        (state, {questions}) => {
            return questions;
        }
    ),
    on(
        QuestionActions.addQuestionSuccess,
        (state, questionReceived) => {
            const deepClonedState = _.cloneDeep(state);
            // Add the newly added question to the Store
            deepClonedState.push(questionReceived.question);
            return deepClonedState;
        }
    ),
    on(
        QuestionActions.deleteQuestionSuccess,
        (state, actionPayload) => {
            // Filter the list of Questions using the JS filter
            // Return those questions whose Id is not the same as the deleted question
            return _.filter(state, (question) => {
                return question.id !== actionPayload.questionId;
            });
        }
    ),
    on(
        QuestionActions.updateQuestionSuccess,
        (state, actionPayload) => {
            // Clone the questions property and for each the questions list
            // Update the question record whose id matches the updated question
            const deepClonedQuestions = _.cloneDeep(state);
            const nextState = deepClonedQuestions.map((question) => {
                if (question.id === actionPayload.question.id) {
                    return actionPayload.question;
                }
                // Return default
                return question;
            });
            return nextState;
        }
    )
);

export const questionSaveStateReducer = createReducer(
    '',
    on(
        QuestionActions.addQuestion,
        QuestionActions.updateQuestion,
        (state, {question}) => {
            return 'IN_PROGRESS';
        }
    ),
    on(
        QuestionActions.addQuestionSuccess,
        QuestionActions.updateQuestionSuccess,
        (state, {question}) => {
            return 'SUCCESS';
        }
    )
)

export const questionDeleteStateReducer = createReducer(
    '',
    on(
        QuestionActions.deleteQuestion,
        (state, questionId) => {
            return 'IN_PROGRESS';
        }
    ),
    on(
        QuestionActions.deleteQuestionSuccess,
        (state, questionId) => {
            return 'SUCCESS';
        }
    )
)

export function reducer(state, action: Action) {
    return questionReducer(state, action);
}

export function questionSaveReducer(state, action: Action) {
    return questionSaveStateReducer(state, action);
}

export function questionDeleteReducer(state, action: Action) {
    return questionDeleteStateReducer(state, action);
}


