import {Action, createReducer, on, State} from '@ngrx/store';
import {observable} from 'rxjs';
import * as CategoryActions from '../actions/category.actions';
import {Category} from '../../model';
import * as _ from 'lodash';
import {AppStore} from '../app-store';

const initialStateCategories: Category[] = [];

const categoriesReducer = createReducer(
    initialStateCategories,
    on(
        CategoryActions.loadCategoriesSuccessAction,
        (state, { categories }) => {
            return categories;
        }
    )
);

export function reducer(state, action: Action) {
    return categoriesReducer(state, action);
}
