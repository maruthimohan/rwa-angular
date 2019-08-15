import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import '../rxjs-extensions';

import { Category } from '../model/category';

@Injectable()
export class CategoryService {

  private _serviceUrl = 'http://localhost:3000/categories';  // URL to web api

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<Category[]> {
    const url = this._serviceUrl;
    return this.http.get(url)
               .pipe(map(res => res as Category[]));
  }
}
