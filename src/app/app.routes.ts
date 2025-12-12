import {Router, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {BudgetsComponent} from './pages/budgets/budgets.component';
import {UsersPageComponent} from './pages/users/users-page.component';
import {ConfigsComponent} from './pages/configs/configs.component';
import {CompositionsComponent} from './pages/compositions/compositions.component';
import {MaterialsComponent} from './pages/materials/materials.component';
import {ProductsComponent} from './pages/products/products.component';
import {CustomersPageComponent} from './pages/customers/customers-page.component';
import {SuppliersPageComponent} from './pages/suppliers/suppliers-page.component';
import {inject} from '@angular/core';

const authGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth-token');

  if (token) {return true;}
  router.navigate(['/login']);
  return false;
};

const adminGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth-token');
  const userRole = sessionStorage.getItem('role');

  if (userRole === 'Administrador') {return true;}
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  router.navigate(['/home']);
  return false;
};

const managerGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth-token');
  const userRole = sessionStorage.getItem('role');

  if (userRole === 'Gerente') {return true;}
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  router.navigate(['/home']);
  return false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'budgets', component: BudgetsComponent, canActivate: [authGuard] },
  { path: 'compositions',  component: CompositionsComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'suppliers', component: SuppliersPageComponent, canActivate: [authGuard] },
  { path: 'materials', component: MaterialsComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomersPageComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersPageComponent, canActivate: [authGuard, adminGuard] },
  { path: 'config', component: ConfigsComponent, canActivate: [authGuard, adminGuard, managerGuard] },
];
