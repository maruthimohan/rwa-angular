import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import * as firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'password-auth',
    templateUrl: './password-auth.component.html',
    styleUrls: ['./password-auth.component.scss']
})
export class PasswordAuthComponent implements OnInit {

    mode: SignInMode;

    signupForm: FormGroup;
    signinForm: FormGroup;
    forgotPasswordForm: FormGroup;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<PasswordAuthComponent>) {
        this.mode = SignInMode.signIn;
    }

    ngOnInit() {
        this.signinForm = this.fb.group({
                email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
            }
        );

        this.signupForm = this.fb.group({
                email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
            }, {validator: signupFormValidator}
        );

        this.forgotPasswordForm = this.fb.group({
                email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
            }
        );
    }


    // signin
    onSigninSubmit() {
        /*this.af.auth.login({
            email: this.signinForm.get('email').value,
            password: this.signinForm.get('password').value
        }, {
            method: AuthMethods.Password
        }).then((user: FirebaseAuthState) => {
            //success
            this.dialogRef.close();
        }, (error: Error) => {
            //error
            console.log(error);
        });*/

        firebase.auth().signInWithEmailAndPassword(
            this.signinForm.get('email').value,
            this.signinForm.get('password').value
        ).then(
            (user: UserCredential) => {
                console.log('User login with Email and Password Successful!');
            },
            (error: Error) => {
                // error
                console.log(error);
            }
        );

    }

    // register
    onSignupSubmit() {

        /*this.af.auth.createUser({
            email: this.signupForm.get('email').value,
            password: this.signupForm.get('password').value
        }).then((user: FirebaseAuthState) => {
            //success
            this.dialogRef.close();
        }, (error: Error) => {
            //error
            console.log(error);
        });*/

        const email = this.signupForm.get('email').value;
        const password = this.signupForm.get('password').value;

        firebase.auth().createUserWithEmailAndPassword(
            email,
            password
        )
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
        });
    }

    // forgot password
    onForgotPasswordSubmit() {
        firebase.auth().sendPasswordResetEmail(this.forgotPasswordForm.get('email').value)
            .then((a: any) => {
                console.log(a);
            },
            (error: Error) => {
                console.log(error);
            }
        );
    }
}

enum SignInMode {
    signIn,
    signUp,
    forgotPassword
}

function signupFormValidator(fg: FormGroup): {[key: string]: boolean} {
    // TODO: check if email is already taken

    // Password match validation
    if (fg.get('password').value !== fg.get('confirmPassword').value) {
        return {passwordmismatch: true};
    }

    return null;
}
