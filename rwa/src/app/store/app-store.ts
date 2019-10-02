import {Category, Question, User} from '../model';
import {CategoryReducers} from './reducers';
import {combineReducers, compose} from '@ngrx/store';

export interface  AppStore {
    categories: Category[];
    categoriesDictionary: { [key: number]: Category };
    tags: string[];
    questions: Question[];
    questionSaveStatus: string;
    questionDeleteStatus: string;
    user: User;
}

export default compose(combineReducers)({
    categories: CategoryReducers.reducer
});
