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

  constructor() { }

  ngOnInit() {

    const storeUser = localStorage.getItem("User");
    const user = JSON.parse(storeUser);

    if(user && user.name){
      this.userName = user.name;
      if(user.type == 'AMD'){
        this.admin = true;
        console.log(this.admin)
      }
      this.isLoggedIn = true;
    } else {
      this.userName = 'Guest';
      this.isLoggedIn = false;
    }

  }

  logout(){
    localStorage.removeItem('User');
    this.userName = 'Guest';
    this.isLoggedIn = false;
    window.location.reload();
  }

}
