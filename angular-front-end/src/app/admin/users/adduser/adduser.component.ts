import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { User } from 'src/app/model/User ';
import { HttpClientService } from 'src/app/service/http-client.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/model/UserProfile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  @Input()
  user: User

  @Output()
  userAddedEvent = new EventEmitter();

  designations: UserProfile[] = [];
  userForm: FormGroup;
  feedback = new FeedBack("", "");
  isSubmitting = false;
  showPassword = false;



  constructor(private httpClientService: HttpClientService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getUserProfile()

    this.feedback = { feedbackType: '', feedbackmsg: '' };

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  addUser(userData) {
    
  }

  onSubmit(): void {

    this.isSubmitting = true;


    this.httpClientService.addUser(this.userForm.value).subscribe(
      (user) => {
        this.userAddedEvent.emit();
        this.router.navigate(['admin', 'users']);
      },
      (error) => {
        console.error('Error adding user:', error);
        this.feedback = {
          feedbackType: error.feedbackType,
          feedbackmsg: error.feedbackmsg,
        };
      },
      () => {
        this.isSubmitting = false;
      }
    );
  }

  getUserProfile() {
    this.httpClientService.getUserProfile().subscribe({
      next: (data: UserProfile[]) => {
       data.map((item: { nameCod: string, cod: string }) => {
          this.designations.push({
            nameCod: item.nameCod,
            cod: item.cod
          });
        });
      },
      error: (err: any) => {
        console.log(err);
        //this.isLoading = false;
        this.feedback = {
          feedbackType: err.type,
          feedbackmsg: err.msg,
        };
      },
      complete: () => {
        //this.isLoading = true;
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
