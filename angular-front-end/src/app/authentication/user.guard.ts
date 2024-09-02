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

            // Controlla se l'utente è loggato e il tipo di utente
            if (user) {
               if (user.type === 'ADM') {
                  if (url === "/login") {
                     // Reindirizza a un'area specifica per l'amministratore
                     return this.router.parseUrl('/admin/users');
                  }
                  // Permetti l'accesso per il tipo ADM
                  return true;
               } else {
                  // Reindirizza se non è un amministratore e cerca di accedere all'area amministrativa
                  if (url === "/admin/users") {
                     return this.router.parseUrl('/shop'); // o qualsiasi altra route per accesso negato
                  }
                  // Permetti l'accesso per altri tipi di utente
                  return true;
               }
            } else {
               // Se l'oggetto user è nullo, reindirizza alla pagina di login
               return this.router.parseUrl('/login');
            }
         } catch (e) {
            console.error("Errore nel parsing dell'utente:", e);
            // Se c'è un errore nel parsing, reindirizza alla pagina di login
            return this.router.parseUrl('/login');
         }
      } else {
         // Se non ci sono dati utente, reindirizza alla pagina di login
         return this.router.parseUrl('/login');
      }
   }
}
