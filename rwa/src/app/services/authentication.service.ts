import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Store} from '@ngrx/store';
import {AppStore} from '../store/app-store';
import {MatDialog, MatDialogRef} from '@angular/material';
import * as firebase from 'firebase';
import {UserActions} from '../store/actions';
import {User} from '../model';
import {LoginComponent} from '../components/login/login.component';
import {take} from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private dialogRef: MatDialogRef<LoginComponent, any>;

    constructor(
        private db: AngularFireDatabase,
        private store: Store<AppStore>,
        private dialog: MatDialog
    ) {
        firebase.auth().onAuthStateChanged(
            (userInfo) => {
                if (userInfo) {
                    console.log('User signed in');
                    console.log(userInfo.displayName + ' : ' + userInfo.email);
                    // Add the user object to the Store
                    this.store.dispatch(UserActions.loginSuccessAction({ user: new User(userInfo)}));
                } else {
                    console.log('User signed out');
                    this.store.dispatch(UserActions.logoffAction());
                }
            }
        );
    }

    ensureLogin = function() {
        if (!this.isAuthenticated) {
            this.showLogin();
        }
    };

    showLogin() {
        console.log('Show console');
        this.dialogRef = this.dialog.open(LoginComponent, {
            disableClose : false
        });
    }

    logout() {
        firebase.auth().signOut();
    }

    get isAuthenticated(): boolean {
        let user: User;
        this.store.pipe(
            take(1)
        ).subscribe(
            (store) => {
                user = store.user;
            }
        );

        /*if (!_.isEmpty(user)) {
            return true;
        }
        return false;*/

        return !_.isEmpty(user);
    }

    get user(): User {
        let user: User;
        this.store.pipe(
            take(1)
        ).subscribe(
            (store) => {
                user = store.user;
            }
        );
        return user;
    }



}
