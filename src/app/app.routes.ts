import {  Routes } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { LoginComponent } from './views/login/login.component';
import { SingupComponent } from './views/singup/singup.component';

export const routes: Routes = [ 
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'singup', component: SingupComponent }
];
