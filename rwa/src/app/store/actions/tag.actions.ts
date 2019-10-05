import {createAction, props} from '@ngrx/store';

export const LOAD_TAGS = 'LOAD_TAGS';
export const LOAD_TAGS_SUCCESS = 'LOAD_TAGS_SUCCESS';

export const loadTagsAction = createAction(
    LOAD_TAGS
);

/**
 * Load Tags Success Action
 */
export const loadTagsSuccessAction = createAction(
    LOAD_TAGS_SUCCESS,
    props<{ tags: string[] }>()
);

