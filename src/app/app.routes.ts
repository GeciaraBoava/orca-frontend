import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {BudgetsComponent} from './pages/budgets/budgets.component';
import {UsersComponent} from './pages/users/users.component';
import {ConfigsComponent} from './pages/configs/configs.component';
import {CompositionsComponent} from './pages/compositions/compositions.component';
import {MaterialsComponent} from './pages/materials/materials.component';
import {SuppliersComponent} from './pages/suppliers/suppliers.component';
import {ProductsComponent} from './pages/products/products.component';
import {CustomersComponent} from './pages/customers/customers.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'compositions',  component: CompositionsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'config', component: ConfigsComponent },
];
