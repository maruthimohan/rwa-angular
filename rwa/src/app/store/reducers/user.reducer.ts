import {Action, createReducer, on} from '@ngrx/store';
import {UserActions} from '../actions';
import {User} from '../../model';

const initialUserState = {};

const userReducer = createReducer(
    initialUserState,
    on(
        UserActions.loginSuccessAction,
        (state, userLoginPayload) => {
            return userLoginPayload.user;
        }
    ),
    on(
        UserActions.logoffAction,
        (state, userLogoffPayload) => {
            return {};
        }
    )
);

/*
 * Export the root user reducer to set the value of the User object in the state
 */
export function reducer(state, action: Action) {
    return userReducer(state, action);
}
