import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class UserGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | UrlTree {
      let url: string = state.url;

      return this.checkLogin(url);
   }

   checkLogin(url: string): true | UrlTree {
      console.log("Url: " + url);
      
      // Supponiamo che 'User' contenga un JSON con i dettagli dell'utente.
      let userString: string | null = localStorage.getItem('User');
      
      if (userString) {
         try {
            let user = JSON.parse(userString);
   
            if (user && user.type === 'ADM') {
               if (url === '/login') {
                  // Reindirizza a un'area specifica per l'amministratore
                  console.log("Redirecting to /admin/users");
                  return this.router.parseUrl('/admin/users');
               }
               // Permetti l'accesso per il tipo ADM
               return true;
            } else if (user) {
               // Non è un amministratore
               if (url === '/admin/users') {
                  console.log("Redirecting to /shop");
                  return this.router.parseUrl('/shop'); // o qualsiasi altra route per accesso negato
               }
               return true;
            } else {
               // Se l'oggetto user è nullo, reindirizza alla pagina di login
               console.log("Redirecting to /login");
               return this.router.parseUrl('/login');
            }
         } catch (e) {
            console.error("Errore nel parsing dell'utente:", e);
            // Se c'è un errore nel parsing, reindirizza alla pagina di login
            console.log("Redirecting to /login due a errore di parsing");
            return this.router.parseUrl('/login');
         }
      } else {
         // Se non ci sono dati utente, reindirizza alla pagina di login
         console.log("Redirecting to /login per mancanza di dati utente");
         return this.router.parseUrl('/login');
      }
   }
}
