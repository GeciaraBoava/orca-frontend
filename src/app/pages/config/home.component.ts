import { Component } from '@angular/core';
import {DefaultLoginLayoutComponent} from "../../components/default-login-layout/default-login-layout.component";
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';

@Component({
  selector: 'app-home.component',
  imports: [
    DefaultHomeLayoutComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

}
