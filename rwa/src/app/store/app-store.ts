import {Category} from '../model';
import {CategoryReducers} from './reducers';
import {combineReducers, compose} from '@ngrx/store';

export interface  AppStore {
    categories: Category[];
}

export default compose(combineReducers)({
    categories: CategoryReducers.reducer
});
