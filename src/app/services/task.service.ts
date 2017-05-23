import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { Task, User } from '../domain';
import { Store } from "@ngrx/store";

@Injectable()
export class TaskService {
  private domain: string = 'tasks';
  private headers = new Headers({
    'Content-Type': 'application/json'
  })
  constructor(
    @Inject('BASE_CONFIG') private config,
    private http: Http) { }

  add(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}`;
    const toAdd = {
      taskListId: task.taskListId,
      desc: task.desc,
      completed: task.completed,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      dueDate: task.dueDate,
      priority: task.priority,
      remark: task.remark,
      reminder: task.reminder,
      createDate: task.createDate
    }
    const addTask$ = this.http
      .post(uri, JSON.stringify(toAdd), {headers: this.headers})
      .map(res => res.json());
    // const addTaskRef$ = this.addTaskRef()
    return addTask$;
      
  }

  update(task: Task): Observable<Task>{
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http
      .put(uri, JSON.stringify(task), {headers: this.headers})
      .map(res => res.json());
  }

  delete(task: Task): Observable<Task>{
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http
      .delete(uri)
      .mapTo(task);
  }

    // GET /tasklist
  get(taskListId: string): Observable<Task[]>{
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get(uri, {params: {'taskListId': taskListId}})
      .map(res => res.json());
  }

  move(taskId:string, taskListId: string){
    const uri = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http
      .patch(uri, JSON.stringify({taskListId: taskListId}), {headers: this.headers})
      .map(res => res.json());
  }

  complete(task: Task){
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http
      .patch(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers})
      .map(res => res.json());
  }

  addTaskRef(user: User, taskId: string){
    const uri = `${this.config.uri}/users/${user.id}`;
    const taskIds = (user.taskIds)? user.taskIds : [];
    const index = taskIds.indexOf(taskId);
    return this.http
      .patch(uri, JSON.stringify({taskIds: [...taskIds, taskId]}), {headers: this.headers})
      .map(res => res.json() as User);
  }

  removeTaskRef(user: User, taskId: string){
    const uri = `${this.config.uri}/users/${user.id}`;
    const taskIds = (user.taskIds)? user.taskIds : [];
    const index = taskIds.indexOf(taskId);
    return this.http
      .patch(uri, JSON.stringify({taskIds: [...taskIds.slice(0, index), taskIds.slice(index+1)]}), {headers: this.headers})
      .map(res => res.json() as User);
  }
}