import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, interval, pipe } from 'rxjs';
import {switchMap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  getTodos() {
    return this._http.get('/todos').pipe(map(result => this.result = result.json().data));
  }

  addTodo(title) {
    return this._http.post('/', {title}).pipe(map(result => this.result = result.json()));
  }

  updateTodos(title, state, id) {
    return this._http.put('/todos', {title, state, id}).pipe(map(result => this.result = result.json()));
  }

  removeTodos(id) {
    return this._http.delete('/', { params: {id: id.join(',')}}).pipe(map(result => this.result = result.json().status));
  }

}
