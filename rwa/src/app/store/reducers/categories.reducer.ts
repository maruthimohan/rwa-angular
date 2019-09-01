import {Action, createReducer, on, State} from '@ngrx/store';
import {observable} from 'rxjs';
import * as CategoryActions from '../actions/category.actions';
import {Category} from '../../model';

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

const categoryDictReducer = createReducer(
    {},
    on(
        CategoryActions.loadCategoriesSuccessAction,
        (state, { categories }) => {
            const categoriesDict: { [key: number]: Category } = {};
            categories.forEach(
                category => {
                    categoriesDict[category.id] = category;
                }
            );
            return categoriesDict;
        }
    )
);

export function reducer(state, action: Action) {
    return categoriesReducer(state, action);
}

export function dictReducer(state, action: Action) {
    return categoryDictReducer(state, action);
}
