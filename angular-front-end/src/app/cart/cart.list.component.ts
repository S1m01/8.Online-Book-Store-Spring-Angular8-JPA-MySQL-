import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedBack } from '../model/FeedBack'; 
import { Book } from 'src/app/model/Book';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.list.component.html',
})
export class CartListComponent implements OnInit {

  cartBooks: Book[] = [];
  feedback = new FeedBack("", "");
  paymentInProgress: boolean = false;

  constructor(private router: Router) { }

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
    this.paymentInProgress = true;
    this.feedback = {
      feedbackType: "success",
      feedbackmsg: "Payment successful!",
    };
  }
}
