import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError, debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import '../rxjs-extensions';

import {Category} from '../model/category';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable()
export class CategoryService {

    private _serviceUrl = 'http://localhost:3000/categories';  // URL to web api
    categories$: Observable<Category[]>;

    constructor(private http: HttpClient,
                private db: AngularFireDatabase) {
        this.categories$ = db.list<Category>('/categories').valueChanges();
    }

    getCategories(): Observable<Category[]> {
        return this.categories$;
        /*const url = this._serviceUrl;
        return this.http.get(url)
            .pipe(map(res => res as Category[]));*/
    }
}
