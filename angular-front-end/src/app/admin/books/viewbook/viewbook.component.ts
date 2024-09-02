import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Book } from 'src/app/model/Book';
import { HttpClientService } from 'src/app/service/http-client.service';
import { Router } from '@angular/router';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-viewbook',
  templateUrl: './viewbook.component.html',
  styleUrls: ['./viewbook.component.css']
})
export class ViewbookComponent implements OnInit {

  @Input()
  book: Book;

  @Output()
  bookDeletedEvent = new EventEmitter<void>();

  @Output()
  errorFeedbackEvent = new EventEmitter<FeedBack>();

  feedback = new FeedBack("", "");

  constructor(private httpClientService: HttpClientService, private router: Router) { }

  ngOnInit() {
  }

  deleteBook() {
    this.httpClientService.deleteBook(this.book.id).subscribe({
      next: (book) => {
        this.bookDeletedEvent.emit();
        this.router.navigate(['admin', 'books']);
      },
      error: (err) => {
        console.error(err);
        this.feedback = {
          feedbackType: 'error',
          feedbackmsg: 'An error occurred while deleting the book.'
        };
        this.errorFeedbackEvent.emit(this.feedback);
      }
    });
  }

  editBook() {
    this.router.navigate(['admin', 'books'], { queryParams: { action: 'edit', id: this.book.id } });
  }
}
