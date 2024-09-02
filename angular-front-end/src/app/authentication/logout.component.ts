import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';

@Component({
   selector: 'app-logout',
   templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

   constructor(private httpClientService: HttpClientService, private router: Router) { }

   ngOnInit() {
    
   }
}