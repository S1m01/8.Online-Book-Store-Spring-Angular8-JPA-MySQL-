import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './admin/users/users.component';
import { BooksComponent } from './admin/books/books.component';
import { ShopbookComponent } from './shopbook/shopbook.component';
import { CartListComponent } from './cart/cart.list.component';
import { PageNotFoundComponent } from './page.not.found.component';
import { LoginComponent } from './authentication/login.component';
import { UserGuard } from './authentication/user.guard';


const routes: Routes = [
  { path: 'admin/users', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'admin/books', component: BooksComponent },
  { path: 'cart', component: CartListComponent },
  { path: 'shop', component: ShopbookComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
