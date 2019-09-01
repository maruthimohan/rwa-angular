import {Question} from '../../model';
import {createAction, props} from '@ngrx/store';

export const LOAD_QUESTIONS = 'LOAD_QUESTIONS';
export const LOAD_QUESTIONS_SUCCESS = 'LOAD_QUESTIONS_SUCCESS';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const DELETE_QUESTION_SUCCESS = 'DELETE_QUESTION_SUCCESS';

export const loadQuestions = createAction(
    LOAD_QUESTIONS
);

export const loadQuestionsSuccess = createAction(
    LOAD_QUESTIONS_SUCCESS,
    props<{ questions: Question[] }>()
);

export const addQuestion = createAction(
    ADD_QUESTION,
    props<{ question: Question }>()
);

export const addQuestionSuccess = createAction(
    ADD_QUESTION_SUCCESS,
    props<{ question: Question }>()
);

export const deleteQuestion = createAction(
    DELETE_QUESTION,
    props<{ questionId: string }>()
);

export const deleteQuestionSuccess = createAction(
    DELETE_QUESTION_SUCCESS,
    props<{ questionId: string }>()
);

export const updateQuestion = createAction(
    UPDATE_QUESTION,
    props<{ question: Question }>()
);

export const updateQuestionSuccess = createAction(
    UPDATE_QUESTION_SUCCESS,
    props<{ question: Question }>()
);


