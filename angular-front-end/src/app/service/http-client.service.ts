import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../model/User ';
import { Book } from '../model/Book';

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

  /*addBookUser(params: any) {
    return this.httpClient.post<any>('http://localhost:8080/user-books/add', {params});   
  }*/

  addBookUser(userId, bookId, quantity) {
    const headers = { 'content-type': 'application/json' }
    return this.httpClient.post<any>(`http://localhost:8080/user-books/add?userId=${userId}&bookId=${bookId}&quantity=${quantity}`, {headers});   
  }

  deleteUser(id) {
    return this.httpClient.delete<User>('http://localhost:8080/users/' + id);
  }

  getBooks(params: any) {
    return this.httpClient.get<Book[]>('http://localhost:8080/books/get', {params});
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
}
