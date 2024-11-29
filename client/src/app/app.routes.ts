import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { DetailsComponent } from './products/details/details.component';
import { authGuard } from './guards/auth.guard';
import { EditComponent } from './products/edit/edit.component';
import { CreateComponent } from './products/create/create.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "catalog", component: CatalogComponent },
  { path: "product", children: [
    { path: 'create', component: CreateComponent },
    { path: ":id", component: DetailsComponent },
    { path: "edit/:id", component: EditComponent }
  ] },
  { path: 'profile', component: ProfileComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "**", component: ErrorComponent }
];
