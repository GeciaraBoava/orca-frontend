import {Component, HostListener, Input, input} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-default-home-layout',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './default-home-layout.component.html',
  styleUrl: './default-home-layout.component.scss',
})
export class DefaultHomeLayoutComponent {
  @Input() pageTitle = "";

  protected readonly name = sessionStorage.getItem('name');
  protected readonly role = sessionStorage.getItem('role');

  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  @HostListener('mouseenter')
  onEnter() {
    document.body.classList.add('sidebar-hover');
  }

  @HostListener('mouseleave')
  onLeave() {
    document.body.classList.remove('sidebar-hover');
  }
}
