import {Action, createAction, props} from '@ngrx/store';
import {User} from '../../model';

export const LOGOFF = 'LOGOFF';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

/*
 * Create User LOG OFF Action
 */
export const logoffAction = createAction(
    LOGOFF
);

/*
 * Create User login success action
 */
export const loginSuccessAction = createAction(
    LOGIN_SUCCESS,
    props<{ user: User }>()
);
