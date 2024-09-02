import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/model/Book';
import { HttpClientService } from 'src/app/service/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Array<Book>;
  booksRecieved: Array<Book>;
  feedback = new FeedBack("", "");
  action: string;
  selectedBook: Book;
  admin: boolean = false;
  isLoading: boolean = true

  constructor(private httpClientService: HttpClientService,
    private activedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.refreshData();

    /*const storedUser = localStorage.getItem('User');
    const user = storedUser ? JSON.parse(storedUser) : null;
    this.admin = user && user.type === 'ADM';

    if (!this.admin) {
      this.feedback = {
        feedbackType: 'error',
        feedbackmsg: 'You are not authorized. Redirecting to home...'
      };
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }*/
  }

  refreshData() {
    this.books = [];
    this.httpClientService.getBooksLib().subscribe({
      next: (data: any) => {
        if (data.length !== 0) {
          this.books = data.books.map(book => ({
            ...book,
            retrievedImage: 'data:image/jpeg;base64,' + book.picByte
          }));
          //this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
        };
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
        this.feedback = {
          feedbackType: err.feedbackType,
          feedbackmsg: err.feedbackmsg,
        };
      },
      complete: () => {
        this.isLoading = true;
        //this.feedback = { feedbackType: 'success', feedbackmsg: 'loaded' };
      },
    });
    
    this.activedRoute.queryParams.subscribe(
      (params) => {
        // get the url parameter named action. this can either be add or view.
        this.action = params['action'];
        // get the parameter id. this will be the id of the book whose details 
        // are to be displayed when action is view.
        const id = params['id'];
        // if id exists, convert it to integer and then retrive the book from
        // the books array
        if (id) {
          this.selectedBook = this.books.find(book => {
            return book.id === +id;
          });
        }
      }
    );
  }

  // we will be taking the books response returned from the database
  // and we will be adding the retrieved   
  handleSuccessfulResponse(response) {
    this.books = new Array<Book>();
    //get books returned by the api call
    this.booksRecieved = response;
    for (const book of this.booksRecieved) {

      const bookwithRetrievedImageField = new Book();
      bookwithRetrievedImageField.id = book.id;
      bookwithRetrievedImageField.name = book.name;
      //populate retrieved image field so that book image can be displayed
      bookwithRetrievedImageField.retrievedImage = 'data:image/jpeg;base64,' + book.picByte;
      bookwithRetrievedImageField.author = book.author;
      bookwithRetrievedImageField.price = book.price;
      bookwithRetrievedImageField.picByte = book.picByte;
      this.books.push(bookwithRetrievedImageField);
    }
  }

  addBook() {
    this.selectedBook = new Book();
    this.router.navigate(['admin', 'books'], { queryParams: { action: 'add' } });
  }

  viewBook(id: number) {
    this.router.navigate(['admin', 'books'], { queryParams: { id, action: 'view' } });
  }

  handleErrorFeedback(feedback: FeedBack) {
    this.feedback = feedback;
    if(this.feedback.feedbackType == 'error') 
      this.isLoading = false;
    else 
    this.isLoading = true;
    // You can now use this.errorFeedback to show the error message in the parent component's template
  }

}
