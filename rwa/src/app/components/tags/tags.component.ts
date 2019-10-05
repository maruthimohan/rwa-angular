import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import {TagService} from '../../services';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../../store/app-store';

@Component({
    // tslint:disable-next-line:component-selector
  selector: 'tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  tags: string[] = [];
  store$: Observable<AppStore>;
  sub: any;

  constructor(private store: Store<AppStore>) {
      this.store$ = store.pipe(select((state) => state));
  }

  ngOnInit() {
    this.sub = this.store$.subscribe(
        (store) => {
            this.tags = store.tags;
        }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
