import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';
import { Book } from '../model/Book';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { FeedBack } from '../model/FeedBack';

@Component({
  selector: 'app-shopbook',
  templateUrl: './shopbook.component.html',
  styleUrls: ['./shopbook.component.css']
})
export class ShopbookComponent implements OnInit {

  books: Array<Book> = [];
  booksRecieved: Array<Book> = [];
  quantityForm: FormGroup;
  searchForm: FormGroup;
  cartBooks: Array<any> = [];
  feedback = new FeedBack("", "");

  totalItems: number = 0;
  pagination: number = 0;
  bookPage: number = 3;
  sortField: string = "name"
  order: string = "DESC";

  constructor(private router: Router, private httpClientService: HttpClientService, private fb: FormBuilder) { }

  ngOnInit() {
    this.feedback = { feedbackType: '', feedbackmsg: '' };

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

    this.searchForm = this.fb.group({
      search: ['']
    });

    this.load();
  }

  load() {
    let params = new HttpParams;

    params = params.append('page', String(this.pagination));
    params = params.append('size', "" + this.bookPage);
    params = params.append('sort', "" + this.sortField);
    params = params.append('order', "" + this.order);

    this.books = [];
    this.httpClientService.getBooks(params).subscribe({
      next: (data: any) => {
        if (data.length !== 0) {
          this.books = data.books.map(book => ({
            ...book,
            retrievedImage: 'data:image/jpeg;base64,' + book.picByte
          }));
          this.totalItems = data.totalItems;
          this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
        };
      },
      error: (err: any) => {
        console.log(err);
        //this.isLoading = false;
        this.feedback = {
          feedbackType: err.feedbackType,
          feedbackmsg: err.feedbackmsg,
        };
      },
      complete: () => {
        //this.isLoading = true;
        //this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
      },
    });
  }

  renderPage(event: number) {
    this.pagination = event - 1;
    this.load();
  }

  toggleSortOrder() {
    this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    this.load();
  }

  setOrderOption(option: string) {
    this.sortField = option;
    this.load();
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
      bookWithRetrievedImageField.quantity = book.quantity;

      return bookWithRetrievedImageField;
    });
  }

  onSearch() {
    this.books = [];
    this.httpClientService.getSearchBooks(this.searchForm.controls.search.value).subscribe({
      next: (data: any) => {
        if (data.length !== 0) {
          this.books = data.map(book => ({
            ...book,
            retrievedImage: 'data:image/jpeg;base64,' + book.picByte
          }));
          this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
        };
      },
      error: (err: any) => {
        console.log(err);
        //this.isLoading = false;
        this.feedback = {
          feedbackType: err.feedbackType,
          feedbackmsg: err.feedbackmsg,
        };
      },
      complete: () => {
        //this.isLoading = true;
        //this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
      },
    });
  }

  onReset(): void {
    this.searchForm.controls.search.setValue('');
    this.onSearch();
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
        author: book.author,
        retrievedImage: book.retrievedImage,
        quantity: quantity
      });
    }

    // Mark book as added
    book.isAdded = true;
    this.updateLocalStorage();
  }

  goToCart() {
    this.router.navigate(['/cart']);
    //save the updated cart data in localstorage
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  }

  removeBook(book: Book) {
    // Filter the cart to remove the specified book
    this.cartBooks = this.cartBooks.filter(cartBook => cartBook.id !== book.id);
    this.updateLocalStorage();

    // Reset book's isAdded status
    const bookInStore = this.books.find(b => b.id === book.id);
    if (bookInStore) {
      bookInStore.isAdded = false;
    }
  }

  emptyCart() {
    this.cartBooks = [];
    localStorage.removeItem('cart');
    this.books.forEach(book => book.isAdded = false);
  }

  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  }
}
