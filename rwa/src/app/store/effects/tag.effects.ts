import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {TagService} from '../../services';
import {TagActions} from '../actions';

@Injectable()
export class TagEffects {

    constructor(
        private tagService: TagService,
        private actions$: Actions
    ) {}


    loadTags$ = createEffect(() => this.actions$.pipe(
        ofType(TagActions.LOAD_TAGS),
        mergeMap(() => this.tagService.getTags()
            .pipe(
                map((tags) => TagActions.loadTagsSuccessAction({tags})),
                catchError(() => EMPTY)
            )
        )
    ));

}
