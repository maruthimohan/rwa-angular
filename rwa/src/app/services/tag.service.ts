import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError, debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import '../rxjs-extensions';
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable()
export class TagService {

    private _serviceUrl = 'http://localhost:3000/tagList';  // URL to web api

    constructor(private http: HttpClient,
                private db: AngularFireDatabase) {
    }

    getTags(): Observable<string[]> {
        return this.db.list('/tagList').valueChanges().pipe(
            map(res => res as string[])
        );

        /*const url = this._serviceUrl;
        return this.http.get(url)
            .pipe(map(res => res as string[]));*/
    }
}
