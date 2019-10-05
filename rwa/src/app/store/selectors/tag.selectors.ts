import {AppStore} from '../app-store';
import {createSelector} from '@ngrx/store';

export const selectTags = createSelector(
    state => state,
    (state: AppStore) => state.tags
);
