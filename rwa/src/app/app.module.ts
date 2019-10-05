import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app/app.component';
import {QuestionsComponent} from './components/questions/questions.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {TagsComponent} from './components/tags/tags.component';
import {CategoryService, QuestionService, TagService} from './services';
import {HttpClientModule} from '@angular/common/http';

import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {QuestionAddUpdateComponent} from './components/question-add-update/question-add-update.component';

import 'hammerjs';
import {CustomSnackBarComponent} from './components/custom-snack-bar/custom-snack-bar.component';
import * as _ from 'lodash';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {CategoryActions} from './store/actions';
import {CategoryReducers, TagReducers, QuestionReducers, UserReducers} from './store/reducers';
import {CategoryEffects, TagEffects, QuestionEffects} from './store/effects';
import {default as reducer} from './store/app-store';
import {AngularFireModule, FirebaseApp} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { LoginComponent } from './components/login/login.component';

import * as firebase from 'firebase';
import { PasswordAuthComponent } from './components/login/password-auth/password-auth.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyCFA2RFVAYZAfUaiwx_sjAuLYGPGoPuA-w',
    authDomain: 'rwa-angular-project-1.firebaseapp.com',
    databaseURL: 'https://rwa-angular-project-1.firebaseio.com',
    projectId: 'rwa-angular-project-1',
    storageBucket: 'rwa-angular-project-1.appspot.com',
    messagingSenderId: '376790856109',
    appId: '1:376790856109:web:e7b137ca3b0f3399'
};

@NgModule({
    declarations: [
        AppComponent,
        QuestionsComponent,
        CategoriesComponent,
        TagsComponent,
        QuestionAddUpdateComponent,
        CustomSnackBarComponent,
        LoginComponent,
        PasswordAuthComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        FormsModule,
        ReactiveFormsModule,

        HttpClientModule,
        AppRoutingModule,

        MaterialModule,
        FlexLayoutModule,

        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,

        StoreModule.forRoot({
            categories: CategoryReducers.reducer,
            tags: TagReducers.reducer,
            categoriesDictionary: CategoryReducers.dictReducer,
            questions: QuestionReducers.reducer,
            questionSaveStatus: QuestionReducers.questionSaveReducer,
            questionDeleteStatus: QuestionReducers.questionDeleteReducer,
            user: UserReducers.reducer
        }),

        EffectsModule.forRoot([CategoryEffects, TagEffects, QuestionEffects])
    ],
    entryComponents: [
        CustomSnackBarComponent,
        LoginComponent,
        PasswordAuthComponent
    ],
    providers: [
        CategoryService, TagService, QuestionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
