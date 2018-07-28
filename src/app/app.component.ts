import { Component } from '@angular/core';
import { DataService } from './data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos: Array<any>;
  activeListNumber: Number = 0;
  todosBackup: Array<any>;
  todoInput: String = '';
  masterCheck: boolean = false;

  constructor(private _dataService: DataService){
    this._dataService.getTodos().subscribe(res => {
      this.todosBackup = this.todos = res
    });
  }

  addTodo(title){
    if(title){
      this._dataService.addTodo(title).subscribe(res => {
        if(res.status === '200'){
          console.log(res);
          this.todos.unshift({_id: res.data[0].id, title, isCompleted: false})
          this.updateTodoList(this.activeListNumber)
          this.todoInput = ''
        }
      });
    }
  }

  changeState(todo){
    this._dataService.updateTodos(todo.title, todo.isCompleted, todo._id).subscribe(res => {
      if(res === '200') {
        this.todos.find(item => item._id === todo._id).isCompleted = todo.isCompleted
        this.updateTodoList(this.activeListNumber);
        if(this.masterCheck && this.todos.find(item => !item.isCompleted)) this.masterCheck = false;
      }
    });
  }

  changeAllStates(){
    const value = this.todos.filter(item => item.isCompleted).length === this.todos.length ? false : true;
    this._dataService.updateTodos(null, value, null).subscribe(res => {
      if(res.status === '200') {
        this.todos.forEach(item => item.isCompleted = value);
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
        this._dataService.removeTodos([todo._id]).subscribe(res => {
          if(res === '200') {
            this.todos = this.todos.filter(item => item._id !== todo._id);
            this.updateTodoList(this.activeListNumber);
          }
        });
      } else if(todo.title !== title){
        this._dataService.updateTodos(title, todo.isCompleted, todo._id).subscribe(res => {
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
    else if(list === 1) this.todosBackup = this.todos.filter(item => !item.isCompleted);
    else if(list === 2) this.todosBackup = this.todos.filter(item => item.isCompleted);
  }

  isCompletedCount(){
    return this.todos ? this.todos.filter(item => item.isCompleted).length : 0
  }

  getItemsLeftCount(){
    return this.todos ? this.todos.filter(item => !item.isCompleted).length : 0
  }

  removeTodos(todo){
    const idsToRemove = todo ? [todo._id] : this.todos.filter(item => item.isCompleted).map(item => item._id)
    this._dataService.removeTodos(idsToRemove).subscribe(res => {
      if(res === '200') {
        this.todos = this.todos.filter(item => !idsToRemove.includes(item._id));
        this.updateTodoList(this.activeListNumber);
        if(this.masterCheck) this.masterCheck = false;
      }
    });
  }

}
