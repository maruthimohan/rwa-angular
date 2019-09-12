import {Action, createReducer, on} from '@ngrx/store';
import { TagActions } from '../actions';

const initialStateTags: string[] = [];

const tagReducer = createReducer(
    initialStateTags,
    on(
        TagActions.loadTagsSuccessAction,
        (state, tagsPayload) => {
            return tagsPayload.tags;
        }
    )
);

/**
 * Reducer root for the Tag Reducer Capability
 */
export function reducer(state, action: Action) {
    return tagReducer(state, action);
}
