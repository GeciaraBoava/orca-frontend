import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-default-home-layout',
  imports: [
    RouterLink
  ],
  templateUrl: './default-home-layout.component.html',
  styleUrl: './default-home-layout.component.scss',
})
export class DefaultHomeLayoutComponent {
  protected readonly name = sessionStorage.getItem('name');
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    this.router.navigate(['/login']);
  }

  navigate(path: string){
    this.router.navigate([path])
  }
}
