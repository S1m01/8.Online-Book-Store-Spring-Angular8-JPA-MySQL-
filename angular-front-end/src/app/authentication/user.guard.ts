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
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    // Estrai i parametri di query dalla route attuale
    const queryParams = next.queryParams;
    const url: string = state.url;

    return this.checkLogin(url, queryParams);
  }

  checkLogin(url: string, queryParams: any): boolean | UrlTree {
    console.log("Url: " + url);
    console.log("Query Params: ", queryParams);

    // Supponiamo che 'User' contenga un JSON con i dettagli dell'utente.
    let userString: string | null = localStorage.getItem('User');

    if (userString) {
      try {
        let user = JSON.parse(userString);

        if (user && user.type === 'ADM') {
          // Se l'utente è un amministratore, gestisci le rotte e i parametri
          if (url.startsWith('/admin/users') && (queryParams['action'] === 'add' || queryParams['action'] === 'view')) {
            console.log("Redirecting to /admin/users");
            return this.router.parseUrl('/admin/users'); // Redirige a /admin/users se l'azione è add o view
          }
          // Permetti l'accesso per il tipo ADM
          return true;
        } else if (user) {
          // Non è un amministratore
          if (url.startsWith('/admin/users')) {
            console.log("Redirecting to /shop");
            window.alert('You are not authorized');
            return this.router.parseUrl('/shop'); // Redirige a /shop se non autorizzato
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
        console.log("Redirecting to /login a causa di errore di parsing");
        return this.router.parseUrl('/login');
      }
    } else {
      // Se non ci sono dati utente, reindirizza alla pagina di login
      console.log("Redirecting to /login per mancanza di dati utente");
      return this.router.parseUrl('/login');
    }
  }
}
