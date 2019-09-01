import {Category, Question} from '../model';
import {CategoryReducers} from './reducers';
import {combineReducers, compose} from '@ngrx/store';

export interface  AppStore {
    categories: Category[];
    categoriesDictionary: { [key: number]: Category };
    tags: string[];
    questions: Question[];
    questionSaveStatus: string;
    questionDeleteStatus: string;
}

export default compose(combineReducers)({
    categories: CategoryReducers.reducer
});
