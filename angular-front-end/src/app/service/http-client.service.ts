import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../model/User ';
import { Book } from '../model/Book';
import { UserProfile } from '../model/UserProfile';
import { Observable } from 'rxjs';
import { UserLogin } from '../model/UserLogin';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient:HttpClient
  ) { }

  getUsers()
  {
    console.log("test call");
    return this.httpClient.get<User[]>('http://localhost:8080/users/get');
  }

  getSearchBooks(search)
  {
    console.log("test search book");
    return this.httpClient.get<any>(`http://localhost:8080/books/search?keyword=${search}`);
  }

  addUser(newUser: User) {
    return this.httpClient.post<User>('http://localhost:8080/users/add', newUser);   
  }

  addBookUser(userId, bookId, quantity) {
    const headers = { 'content-type': 'application/json' }
    return this.httpClient.post<any>(`http://localhost:8080/user-books/add?userId=${userId}&bookId=${bookId}&quantity=${quantity}`, {headers});   
  }

  updateUser(updatedUser: User, id: number): Observable<User> {
    const body = JSON.stringify(updatedUser);
    return this.httpClient.put<User>(`http://localhost:8080/users/update/${id}`, updatedUser);
  }

  deleteUser(id) {
    return this.httpClient.delete<User>('http://localhost:8080/users/' + id);
  }

  getBooks(params: any) {
    return this.httpClient.get<Book[]>('http://localhost:8080/books/get', {params});
  }

  getBooksLib() {
    return this.httpClient.get<Book[]>('http://localhost:8080/books/get');
  }
  
  getUserProfile() {
    return this.httpClient.get<UserProfile[]>('http://localhost:8080/type/get');
  }

  addBook(newBook: Book) {
    return this.httpClient.post<Book>('http://localhost:8080/books/add', newBook);
  }

  deleteBook(id) {
    return this.httpClient.delete<Book>('http://localhost:8080/books/' + id);
  }

  updateBook(updatedBook: Book) {
    return this.httpClient.put<Book>('http://localhost:8080/books/update', updatedBook);
  }

  login(login: UserLogin): Observable<UserLogin>{
    return this.httpClient.post<UserLogin>(`http://localhost:8080/users/login`, login, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
}
