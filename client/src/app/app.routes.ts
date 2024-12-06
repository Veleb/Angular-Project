import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { PageNotFoundComponent } from './page-not-found/error.component';
import { DetailsComponent } from './products/details/details.component';
import { EditComponent } from './products/edit/edit.component';
import { CreateComponent } from './products/create/create.component';
import { ProfileComponent } from './user/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ownerGuard } from './guards/owner.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  
  { path: "home", component: HomeComponent },
  { path: "catalog", component: CatalogComponent },

  { path: "product", children: [
    { path: 'create', component: CreateComponent, canActivate: [authGuard] },
    { path: ":id", component: DetailsComponent },
    { path: "edit/:id", component: EditComponent, canActivate: [ownerGuard] }
  ] },

  { path: 'profile', children: [
    { path: '', component: ProfileComponent, canActivate: [authGuard] },
    { path: ':id', component: ProfileComponent, canActivate: [authGuard] },
  ]},

  { path: 'chat', children: [
    // { path: ':productId/:chatId', chatComponent }
  ]},

  { path: "register", component: RegisterComponent, canActivate: [guestGuard] },
  { path: "login", component: LoginComponent, canActivate: [guestGuard] },

  { path: "404", component: PageNotFoundComponent },
  { path: "**", redirectTo: '/404' , pathMatch: 'full'},
];
