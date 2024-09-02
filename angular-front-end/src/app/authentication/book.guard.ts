import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
   providedIn: 'root'
})
export class ProductGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(
      next: ActivatedRouteSnapshot,
      // Contains the information about a route associated with a component loaded in an outlet at a particular moment in time
      state: RouterStateSnapshot
      // Represents the state of the router at a moment in time.
   ): boolean | UrlTree {// UrlTree is a data structure that provides a lot of affordances in dealing with URLs
      let url: string = state.url;

      return this.checkLogin(url);
   }

   checkLogin(url: string): true | UrlTree {
      console.log("Url: " + url)
      let val: string = localStorage.getItem('isSalLoggedIn');

      if (val != null && val == "true") {
         if (url == "/login")
            this.router.parseUrl('/product-edit');
         // Analizza una stringa URL in un oggetto UrlTree, che può essere utilizzato per analizzare o manipolare l'URL.

         else
            return true;
      } else {
         return this.router.parseUrl('/login');
      }
   }
}