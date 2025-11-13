import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'budgets',
    component: HomeComponent
  },
  {
    path: 'productItems',
    component: HomeComponent
  },
  {
    path: 'suppliers',
    component: HomeComponent
  },
  {
    path: 'materials',
    component: HomeComponent
  },
  {
    path: 'customers',
    component: HomeComponent
  },
  {
    path: 'users',
    component: HomeComponent
  },
  {
    path: 'config',
    component: HomeComponent
  },
];
