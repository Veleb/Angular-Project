import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ErrorComponent } from './error/error.component';
import { DetailsComponent } from './products/details/details.component';
import { EditComponent } from './products/edit/edit.component';
import { CreateComponent } from './products/create/create.component';
import { ProfileComponent } from './user/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ownerGuard } from './guards/owner.guard';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "catalog", component: CatalogComponent },
  { path: "product", children: [
    { path: 'create', component: CreateComponent, canActivate: [authGuard] },
    { path: ":id", component: DetailsComponent },
    { path: "edit/:id", component: EditComponent, canActivate: [ownerGuard] }
  ] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "**", component: ErrorComponent }
];
