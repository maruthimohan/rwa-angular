import {Action, createAction, props} from '@ngrx/store';
import {Category} from '../../model';

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS';

export const loadCategoriesAction = createAction(
    LOAD_CATEGORIES
);

export const loadCategoriesSuccessAction = createAction(
    LOAD_CATEGORIES_SUCCESS,
    props<{ categories: Category[] }>()
);


/*static loadCategories = (): Action => {
    return CategoryActions.loadCategoriesAction();
}

static loadCategoriesSuccess(categories: Category[]): Action {
    return CategoryActions.loadCategoriesSuccessAction({categories});
}*/
