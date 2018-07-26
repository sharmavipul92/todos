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
    return this._http.get('/api/todos').pipe(map(result => this.result = result.json().data));
  }

  addTodo(text) {
    return this._http.post('/api/todo', {text}).pipe(map(result => this.result = result.json()));
  }

  updateTodos(text, state, id) {
    return this._http.put('/api/todos', {text, state, id}).pipe(map(result => this.result = result.json().status));
  }

  removeTodos(id) {
    return this._http.delete('/api/todos', { params: {id: id.join(',')}}).pipe(map(result => this.result = result.json().status));
  }

}
