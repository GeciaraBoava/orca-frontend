import { Component } from '@angular/core';
import {DefaultLoginLayoutComponent} from "../../components/default-login-layout/default-login-layout.component";
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';

@Component({
  selector: 'app-users',
  imports: [
    DefaultHomeLayoutComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {

}
