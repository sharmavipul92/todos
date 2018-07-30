import { Component } from '@angular/core';
import { DataService } from './data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos: Array<any>;
  activeListNumber: number = 0;
  todosBackup: Array<any>;
  todoInput: String = '';
  masterCheck: boolean = false;
  order: number = 1;

  constructor(private _dataService: DataService){
    this._dataService.getTodos().subscribe(res => {
      if(res) {
        this.todosBackup = this.todos = res;
      }
      else this.todosBackup = this.todos = []
    });
  }

  addTodo(title){
    if(title){
      this._dataService.addTodo(title, this.order += 1).subscribe(res => {
        if(res.status === '200'){
          this.todos.unshift({_id: res._id, title: res.title, order: res.order, completed: res.completed})
          this.updateTodoList(this.activeListNumber)
          this.todoInput = ''
        }
      });
    }
  }

  changeState(todo){
    this._dataService.updateTodosById(todo._id, todo.title, todo.completed, todo.order).subscribe(res => {
      if(res === '200') {
        this.todos.find(item => item._id === todo._id).completed = todo.completed
        this.updateTodoList(this.activeListNumber);
        if(this.masterCheck && this.todos.find(item => !item.completed)) this.masterCheck = false;
      }
    });
  }

  changeAllStates(){
    const value = this.todos.filter(item => item.completed).length === this.todos.length ? false : true;
    this._dataService.updateTodos(value).subscribe(res => {
      if(res.status === '200') {
        this.todos.forEach(item => item.completed = value);
        this.updateTodoList(this.activeListNumber);
      }
    });
  }

  editTodo(event, todo){
    if(event.type === 'keydown'){
      event.srcElement.blur();
    } else if(event.type === 'blur'){
      const title = event.target.innerText;
      if(!title){
        this.removeTodoById(todo._id);
      } else if(todo.title !== title){
        this._dataService.updateTodosById(todo._id, title, todo.completed, todo.order).subscribe(res => {
          if(res === '200') {
            this.todos.find(item => item._id === todo._id).title = title;
            this.updateTodoList(this.activeListNumber);
          }
        });
      }
    }
  }

  updateTodoList(list){
    this.activeListNumber = list;
    if(list === 0) this.todosBackup = [...this.todos];
    else if(list === 1) this.todosBackup = this.todos.filter(item => !item.completed);
    else if(list === 2) this.todosBackup = this.todos.filter(item => item.completed);
  }

  completedCount(){
    return this.todos ? this.todos.filter(item => item.completed).length : 0
  }

  getItemsLeftCount(){
    return this.todos ? this.todos.filter(item => !item.completed).length : 0
  }

  removeTodos(){
    if(this.masterCheck) {
      this._dataService.removeTodos().subscribe(res => {
        if(res.status === '200') {
          this.todos = [];
          this.updateTodoList(this.activeListNumber);
          if(this.masterCheck) this.masterCheck = false;
        }
      });
    } else {
      const idsToRemove = this.todos.filter(item => item.completed).map(item => item._id)
      this._dataService.removeTodosById(idsToRemove).subscribe(res => {
        if(res.status === '200') {
          this.todos = this.todos.filter(item => !idsToRemove.includes(item._id));
          this.updateTodoList(this.activeListNumber);
        }
      });
    }
  }

  removeTodoById(id){
    this._dataService.removeTodoById(id).subscribe(res => {
      if(res.status === '200') {
        this.todos = this.todos.filter(item => item._id !== id);
        this.updateTodoList(this.activeListNumber);
      }
    });
  }

}
