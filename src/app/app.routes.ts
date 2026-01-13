import {CanActivate, Router, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {BudgetsComponent} from './pages/budgets/budgets.component';
import {UsersPageComponent} from './pages/users/users-page.component';
import {ConfigsPageComponent} from './pages/configs/configs-page.component';
import {CompositionsComponent} from './pages/compositions/compositions.component';
import {ProductsComponent} from './pages/products/products.component';
import {CustomersPageComponent} from './pages/customers/customers-page.component';
import {SuppliersPageComponent} from './pages/suppliers/suppliers-page.component';
import {MaterialsPageComponent} from './pages/materials/materials-page.component';
import {inject} from '@angular/core';
import {AuthService} from './services/auth.service';

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

const adminOrManagerGuard = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth-token');
  const userRole = sessionStorage.getItem('role');

  if (userRole === 'Gerente' || userRole === 'Administrador') {return true;}
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
  { path: 'materials', component: MaterialsPageComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomersPageComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersPageComponent, canActivate: [authGuard, adminGuard] },
  { path: 'configs', component: ConfigsPageComponent, canActivate: [authGuard, adminOrManagerGuard] },
];

export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLogged()) {
      return true;
    }

    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
