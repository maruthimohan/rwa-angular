import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryActions, QuestionActions, TagActions} from '../../store/actions';
import * as firebase from 'firebase';
import {AppStore} from '../../store/app-store';
import {Store} from '@ngrx/store';
import {User} from '../../model';
import {AuthenticationService} from '../../services/authentication.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'rwa';
    user: User;
    sub: any;
    sub2: any;

    constructor(
        private store: Store<AppStore>,
        private authService: AuthenticationService
    ) {
        this.sub2 = store.subscribe(
            (storeNG) => {
                this.user = storeNG.user;
            }
        );
    }

    ngOnInit() {
        this.store.dispatch(CategoryActions.loadCategoriesAction());
        this.store.dispatch(TagActions.loadTagsAction());
        this.store.dispatch(QuestionActions.loadQuestions());
    }

    ngOnDestroy(): void {
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
    }

    login() {
        this.authService.ensureLogin();
    }

    logout() {
        this.authService.logout();
    }

    get isUserEmpty(): boolean {
        return _.isEmpty(this.user);
    }

}
