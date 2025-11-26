import { Component } from '@angular/core';
import {DefaultLoginLayoutComponent} from "../../components/default-login-layout/default-login-layout.component";
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';

@Component({
  selector: 'app-home.component',
  imports: [
    DefaultHomeLayoutComponent
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent {

}
