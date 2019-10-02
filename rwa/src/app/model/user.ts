import { FirebaseAuth } from '@angular/fire';
import UserCredential = firebase.auth.UserCredential;
import * as firebase from 'firebase';

export class User {
    userId: string;
    displayName: string;
    email: string;
    firebaseUser: firebase.User;

    constructor(user: firebase.User) {
        if (user) {
            console.log(user);
            this.firebaseUser = user;
            this.userId = user.uid;
            this.email = user.email;
            this.displayName = user.displayName;
        } else {
            this.userId = '';
            this.displayName = '';
            this.email = '';
            this.firebaseUser = null;
        }
    }
}
