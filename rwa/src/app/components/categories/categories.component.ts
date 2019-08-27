import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';

import {Category} from '../../model';
import {CategoryService} from '../../services';
import {AppStore} from '../../store/app-store';
import {Store, select} from '@ngrx/store';
import {CategoryActions} from '../../store/actions';
import {CategorySelectors} from '../../store/selectors';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'category-list',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
    categories: Category[];
    store$: Observable<AppStore>;
    sub: any;

    constructor(private store: Store<AppStore>) {
        this.store$ = store.pipe(select(state => {
            return state;
        }));
    }

    ngOnInit() {

        // this.categories = this.store.pipe(select(CategorySelectors.selectCategories));
        // this.store.dispatch(CategoryActions.loadCategoriesAction());  // Generate an intent to load Categories
        this.sub = this.store$.subscribe(
            (state) => {
                this.categories = state.categories;
            }
        );
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

}
