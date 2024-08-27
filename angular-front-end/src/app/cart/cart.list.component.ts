import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedBack } from '../model/FeedBack'; 
import { Book } from 'src/app/model/Book';
import { HttpParams } from '@angular/common/http';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.list.component.html',
})
export class CartListComponent implements OnInit {

  cartBooks: Book[] = [];
  feedback = new FeedBack("", "");
  paymentInProgress: boolean = false;

  constructor(private router: Router, private httpClientService: HttpClientService) { }

  ngOnInit() {
    // Recupera i dati del carrello dal localStorage
    const data = localStorage.getItem('cart');
    if (data !== null) {
      this.cartBooks = JSON.parse(data);
    }
  }

  // Calcola il prezzo totale del carrello
  get totalPrice(): number {
    return this.cartBooks.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Rimuove un libro dal carrello
  removeFromCart(book: Book) {
    this.cartBooks = this.cartBooks.filter(cartBook => cartBook.id !== book.id);
    localStorage.setItem('cart', JSON.stringify(this.cartBooks));
  }

  // Svuota l'intero carrello
  emptyCart() {
    this.cartBooks = [];
    localStorage.removeItem('cart');
  }

  // Procede al checkout o ad altre azioni
  proceedToCheckout() {
    this.bookUserOrder();
    this.paymentInProgress = true;
    this.feedback = {
      feedbackType: "success",
      feedbackmsg: "Payment successful!",
    };
  }

  bookUserOrder(){
    let userId = 1;
    this.cartBooks.forEach((cartItem: any) => {
      /*let params = new HttpParams;
    
      params = params.append('quantity', cartItem.quantity.toString());
      params = params.append('userId', ""+userId);
      params = params.append('bookId', cartItem.id.toString());*/

      this.httpClientService.addBookUser(userId, cartItem.id.toString(), cartItem.quantity.toString()).subscribe({
          next: (data: any) => {
              console.log('Order book added successfully');
          },
          error: (err: any) => {
              console.error('Error occurred:', err);
              this.feedback = {
                  feedbackType: err.feedbackType,
                  feedbackmsg: err.feedbackmsg,
              };
          },
          complete: () => {
          },
      });
  });
  }
}
