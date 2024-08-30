import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User ';
import { HttpClientService } from 'src/app/service/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'src/app/model/UserProfile';
import { FeedBack } from 'src/app/model/FeedBack';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  users: Array<User>;
  action: string;
  selectedUser: User;
  designations: UserProfile[] = [];
  feedback = new FeedBack("", "");


  constructor(private httpClientService: HttpClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.refreshData();
    this.loadDesignations();

    this.feedback = { feedbackType: '', feedbackmsg: '' };
  }

  refreshData(){
    //console.log('Test');
    this.httpClientService.getUsers().subscribe(
      response => this.handleSuccessfulResponse(response),
    );

    this.activatedRoute.queryParams.subscribe(
      (params) => {
        this.action = params['action'];
        const selectedUserId = params['id'];
        if (selectedUserId) {
          this.selectedUser = this.users.find(user => user.id === +selectedUserId);
        }
      }
    );

  }

  loadDesignations() {
    // Example call - adjust according to your actual service
    this.httpClientService.getUserProfile().subscribe({
      next: (response: UserProfile[]) => {
        this.designations = response;
      },
      error: (error) => {
        console.error('Error loading designations', error);
        this.feedback = {
          feedbackType: error.feedbackType,
          feedbackmsg: error.feedbackmsg,
        };
      },
      complete: () => {
      }
    });
  }
  

  viewUser(id: number) {
    this.router.navigate(['admin','users'], {queryParams : {id, action: 'view'}});
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], { queryParams: { action: 'add' } });
  }

  handleSuccessfulResponse(response) {
    this.users = response;
  }

  getDesignationName(cod: string): string {
    const designation = this.designations.find(d => d.cod === cod);
    return designation ? designation.nameCod : 'ERROR Not Found';
  }
  

}
