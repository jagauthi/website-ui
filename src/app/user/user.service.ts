import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { User } from './user';
import { USERS } from './mock-users';
import { MessageService } from '../components/message/message.service'

@Injectable()
export class UserService {

  private usersUrl = "http://localhost:8080/getAccounts";
  private loginUrl= "http://localhost:8080/login";
  private getUserUrl= "http://localhost:8080/getAccount?username=";
  private updateUserUrl= "http://localhost:8080/updateAccount";
  private addUserUrl = 'http://localhost:8080/addAccount'
  private deleteUserUrl = 'http://localhost:8080/deleteAccount?username='

  private httpOptions = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/json' }
    )
  };

  public activeUser = {
    userId: 0,
    username: "",
    password: "",
    email: ""
  }

  constructor(
    private http: HttpClient, 
    private messageService: MessageService
  ) { }

  getUsers(): Observable<User[]> {
    this.log(`Fetching users`);
    return this.http.get<User[]>(this.usersUrl)
      .pipe( 
        tap(users => this.log(`Fetched.`)),
        catchError( this.handleError( 'getAccounts', [] ) ) 
      );
  }

  getUser(name: string): Observable<User> {
    this.log(`Fetching user name=${name}`);

    const url = `${this.getUserUrl}${name}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`Fetched user name=${name}`)),
      catchError(this.handleError<User>(`getUser name=${name}`))
    );
  }

  login(user: User): Observable<User> {
    return this.http.post(this.loginUrl, user, this.httpOptions).pipe(
      tap((data) => {
        this.log("Data: " + data['username']);
        this.activeUser = data as User;
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put(this.updateUserUrl, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user name=${user.userId}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  createAccount (user: User): Observable<number> {
    return this.http.post<number>(this.addUserUrl, user, this.httpOptions).pipe(
      tap(() => this.log("Added user: " + user.username)),
      catchError(this.handleError<number>('addUser'))
    );
  }

  deleteUser (user: User): Observable<number> {
    const url = this.deleteUserUrl + user.username;
    return this.http.get<number>(url).pipe(
      tap(() => this.log("Deleted user name " + user.username)),
      catchError(this.handleError<number>(`deleteUser name=${user.username}`))
    );
  }

  resetUser() {
    this.activeUser = undefined;
  }

  log(message: string): void {
    this.messageService.add("UserService: " + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: Better error logging
      console.error(error);
      this.log(operation + " + failed: " + error.message);
  
      return of(result as T);
    };
  }

}
