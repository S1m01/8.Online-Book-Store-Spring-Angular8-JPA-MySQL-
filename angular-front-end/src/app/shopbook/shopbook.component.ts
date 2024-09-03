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
  bookPage: number = 10;
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
    let params = new HttpParams()
        .append('page', String(this.pagination))
        .append('size', String(this.bookPage))
        .append('sort', this.sortField)
        .append('order', this.order);

    this.books = [];
    this.httpClientService.getBooks(params).subscribe({
        next: (data: any) => {
            if (data.books && data.books.length > 0) {
                this.books = data.books.map(book => {
                    const priceValue = parseFloat(book.price);
                    const discountValue = parseFloat(book.sale);

                    // Calculate the final price
                    const finalPrice = discountValue > 0 
                        ? priceValue - (priceValue * discountValue / 100) 
                        : priceValue;

                    return {
                        ...book,
                        retrievedImage: 'data:image/jpeg;base64,' + book.picByte,
                        finalPrice: finalPrice.toFixed(2) // Ensure the final price is formatted correctly
                    };
                });
                console.log(this.books)
                this.totalItems = data.totalItems;
                this.feedback = { feedbackType: 'success', feedbackmsg: 'Loaded successfully' };
            } else {
                this.feedback = { feedbackType: 'info', feedbackmsg: 'No books found' };
            }
        },
        error: (err: any) => {
            console.error('Error loading books:', err);
            this.feedback = {
                feedbackType: 'error',
                feedbackmsg: err.message || 'An error occurred while loading books'
            };
        }
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
    this.pagination = 0;
    this.totalItems = 0;
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

  get totalPrice(): number {
    return this.cartBooks.reduce((total, book) => total + (book.price * book.quantity), 0);
  }
}
