import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isLoggedIn = false;
  userName: string = null;
  admin: boolean = false;
  mrk: boolean = false;

  constructor() { }

  ngOnInit() {

    const storeUser = localStorage.getItem("User");
    const user = JSON.parse(storeUser);

    if(user && user.name){
      this.userName = user.name;
      if(user.type == 'ADM'){
        this.admin = true;
        this.mrk = false;
      }
      if(user.type == 'MRK'){
        this.admin = false;
        this.mrk = true;
      }
      this.isLoggedIn = true;
    } else {
      this.userName = 'Guest';
      this.isLoggedIn = false;
      this.admin = false;
      this.mrk = false;

    }

  }

  logout(){
    localStorage.removeItem('User');
    this.userName = 'Guest';
    this.isLoggedIn = false;
    window.location.reload();
  }

}
