import { Injectable } from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CategoryService } from '../../services';
import * as CategoryActions from '../actions/category.actions';

@Injectable()
export class CategoryEffects {

    constructor(
        private actions$: Actions,
        private categoryService: CategoryService
    ) {}

    loadCategories$ = createEffect(() => this.actions$.pipe(
        ofType(CategoryActions.LOAD_CATEGORIES),
        mergeMap(() => this.categoryService.getCategories()
            .pipe(
                map(categories => CategoryActions.loadCategoriesSuccessAction({ categories })),
                catchError(() => EMPTY)
            )
        )
    ));

}







