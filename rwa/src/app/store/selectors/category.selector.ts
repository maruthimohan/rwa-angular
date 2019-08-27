import {AppStore} from '../app-store';
import {createSelector} from '@ngrx/store';

export const selectCategories = createSelector(
    state => state,
    (state: AppStore) => state.categories
);
