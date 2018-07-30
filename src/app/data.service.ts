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
    return this._http.get('http://localhost:4000/').pipe(map(result => this.result = result.json()));
  }

  addTodo(title, order) {
    return this._http.post('http://localhost:4000/', {title, order}).pipe(map(result => this.result = result.json()));
  }

  updateTodosById(id, title, state, order) {
    return this._http.patch('http://localhost:4000/' + id, {title, state, order}).pipe(map(result => this.result = result.json()));
  }

  updateTodos(state) {
    return this._http.put('http://localhost:4000/', {state}).pipe(map(result => this.result = result.json()));
  }

  removeTodoById(id) {
    return this._http.delete('http://localhost:4000/' + id).pipe(map(result => this.result = result.json()));
  }

  removeTodosById(id) {
    return this._http.delete('http://localhost:4000/', { params: {id} }).pipe(map(result => this.result = result.json()));
  }

  removeTodos() {
    return this._http.delete('http://localhost:4000/').pipe(map(result => this.result = result.json()));
  }

}
