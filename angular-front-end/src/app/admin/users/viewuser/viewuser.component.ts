import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/model/User '; 
import { HttpClientService } from 'src/app/service/http-client.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from 'src/app/model/UserProfile';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output() userDeletedEvent = new EventEmitter();

  showPassword = false;
  userForm: FormGroup;
  designations: UserProfile[] = [];
  feedback = new FeedBack("", "");
  id: number = 0;


  constructor(
    private httpClientService: HttpClientService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Initialize the form group
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Set form values if user input is available
    if (this.user) {
      this.setUserFormValues();
    }

    this.feedback = { feedbackType: '', feedbackmsg: '' };

    this.getUserProfile();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Ensure that userForm is defined before accessing it
    if (changes.user && changes.user.currentValue && this.userForm) {
      this.setUserFormValues();
    }
  }

  setUserFormValues() {
    if (this.userForm) { // Safe check to ensure userForm is defined
      this.userForm.patchValue({
        name: this.user.name,
        type: this.user.type,
        password: this.user.password
      });
      this.id = this.user.id;
    }
  }

  getUserProfile(): void {
    this.httpClientService.getUserProfile().subscribe({
      next: (data: UserProfile[]) => {
        this.designations = data.map((item: { nameCod: string, cod: string }) => ({
          nameCod: item.nameCod,
          cod: item.cod
        }));
      },
      error: (err: any) => {
        console.log(err);
        this.feedback = {
          feedbackType: err.type,
          feedbackmsg: err.msg,
        };
      }
    });
  }

  onSave(): void {
    this.httpClientService.updateUser(this.userForm.value, this.id).subscribe({
      next: (data: User) => {
        this.userDeletedEvent.emit();
        this.router.navigate(['admin', 'users']);
      },
      error: (err: any) => {
        console.log(err);
        this.feedback = {
          feedbackType: err.type,
          feedbackmsg: err.msg,
        };
      }
    });
  }

  deleteUser() {
    if (this.user && this.user.id) {
      this.httpClientService.deleteUser(this.user.id).subscribe(() => {
        this.userDeletedEvent.emit();
        this.router.navigate(['admin', 'users']);
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
