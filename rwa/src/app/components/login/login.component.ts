import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import * as firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import {PasswordAuthComponent} from './password-auth/password-auth.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private passwordDialogRef: MatDialogRef<PasswordAuthComponent, any>;

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        public dialog: MatDialog
    ) {
    }

    ngOnInit() {

    }

    loginWithPopup(provider: AuthProvider) {
        firebase.auth().signInWithPopup(provider).then((result) => {
            // This gives you a Google Access Token.
            const token = result.user.refreshToken;
            // The signed-in user info.
            const user = result.user;
        });
    }

    googleLogin() {
        // tslint:disable-next-line:prefer-const
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        // Login using the Google Provider
        this.loginWithPopup(provider);
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('public_profile');
        provider.addScope('email');
        // Login using Facebook Provider
        this.loginWithPopup(provider);
    }

    githubLogin() {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('repos');
        // Login with GitHub Provider
        this.loginWithPopup(provider);
    }

    twitterLogin() {
        const provider = new firebase.auth.TwitterAuthProvider();
        // Login with Twitter Provider
        this.loginWithPopup(provider);
    }

    passwordLogin() {
        this.passwordDialogRef = this.dialog.open(PasswordAuthComponent, {
            disableClose: false,
            width: '600px',
            height: '400px'
        });
    }

}

