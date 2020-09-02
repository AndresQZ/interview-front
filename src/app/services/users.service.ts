import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Client} from '../model/Client';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GenericResponse } from '../model/GenericResponse';
import { environment} from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private articleUrl = '/client/v0/';
  private saveUserUrl = '/client/v0/';
  private deleteUrl = '/client/v0/';
  private host = environment.host;


  constructor(
    private httpClient: HttpClient) { }

   public getUser() : Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.buildUrlService(this.articleUrl)).pipe(catchError(this.handleError<Client[]>('getBracelets',[])))
   }

   public getUserById(id : Number) : Observable<Client> {
    return this.httpClient.get<Client>(this.buildUrlServiceWithParthVariable(this.articleUrl,id)).pipe(catchError(this.handleError<Client>('getBracelets',null)))
   } 

   public deleteUser(id: Number): Observable<Client[]> {
    return this.httpClient.delete<Client[]>(this.buildUrlServiceWithParthVariable(this.deleteUrl, id), httpOptions).pipe(catchError(this.handleError<Client[]>('getBracelets',[])))
  }

  public saveUser(client: Client) : Observable <GenericResponse> {
    return this.httpClient.post<GenericResponse>(this.buildUrlService(this.saveUserUrl), client, httpOptions).pipe(catchError(this.handleError<GenericResponse>('saveUser', null)))
  }

  public updateUser(client: Client) : Observable <GenericResponse> {
    return this.httpClient.put<GenericResponse>(this.buildUrlService(this.saveUserUrl), client, httpOptions).pipe(catchError(this.handleError<GenericResponse>('saveUser', null)))
  }


   private buildUrlService(url : string): string {
    return `${this.host}${url}`;
  }

  private buildUrlServiceWithParthVariable(url : string, pathVariable: any): string {
    return `${this.host}${url}${pathVariable}`;
  }


  

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
