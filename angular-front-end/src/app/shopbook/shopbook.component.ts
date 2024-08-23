import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';
import { Book } from '../model/Book';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shopbook',
  templateUrl: './shopbook.component.html',
  styleUrls: ['./shopbook.component.css']
})
export class ShopbookComponent implements OnInit {

  books: Array<Book> = [];
  booksRecieved: Array<Book> = [];
  quantityForm: FormGroup;
  cartBooks: Array<any> = [];

  constructor(private router: Router, private httpClientService: HttpClientService, private fb: FormBuilder) { }

  ngOnInit() {
    this.httpClientService.getBooks().subscribe(
      response => this.handleSuccessfulResponse(response)
    );

    // Initialize cartBooks from localStorage if available
    const cartData = localStorage.getItem('cart');
    if (cartData !== null) {
      this.cartBooks = JSON.parse(cartData);
    } else {
      this.cartBooks = [];
    }

    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  handleSuccessfulResponse(response: any) {
    this.booksRecieved = response;
    this.books = this.booksRecieved.map(book => {
      const bookWithRetrievedImageField = new Book();
      bookWithRetrievedImageField.id = book.id;
      bookWithRetrievedImageField.name = book.name;
      bookWithRetrievedImageField.retrievedImage = 'data:image/jpeg;base64,' + book.picByte;
      bookWithRetrievedImageField.author = book.author;
      bookWithRetrievedImageField.price = book.price;
      bookWithRetrievedImageField.picByte = book.picByte;
      bookWithRetrievedImageField.isAdded = false; // Initialize as not added

      return bookWithRetrievedImageField;
    });
  }

  addToCart(bookId: number) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    const quantity = this.quantityForm.get('quantity').value;

    // Add or update book in cartBooks
    const existingBookIndex = this.cartBooks.findIndex((item: any) => item.id === bookId);
    if (existingBookIndex > -1) {
      this.cartBooks[existingBookIndex].quantity += quantity;
    } else {
      this.cartBooks.push({
        id: book.id,
        name: book.name,
        price: book.price,
        retrievedImage: book.retrievedImage,
        quantity: quantity
      });
    }

    // Mark book as added
    book.isAdded = true;
  }

  goToCart() {
    // Save cartBooks to localStorage when viewing cart
    this.router.navigate(['/cart']);
  }

  removeBook(book: Book) {
    // Filtra il carrello per rimuovere il libro specificato
    this.cartBooks = this.cartBooks.filter(cartBook => cartBook.id !== book.id);
  
    // Aggiorna il carrello nel localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  
    // Imposta la proprietà isAdded del libro rimosso su false
    book.isAdded = false;
  }

  emptyCart() {
    this.cartBooks = [];
    localStorage.removeItem('cart');
    this.books.forEach(book => book.isAdded = false);
  }
}
