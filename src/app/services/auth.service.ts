import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../types/login-response.type';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = "http://localhost:8082/auth";

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", {username, password})
      .pipe(
        tap((response) => { //tap - retorna um valor síncrono
          sessionStorage.setItem("auth-token", response.token)
          sessionStorage.setItem("name", response.name)
          sessionStorage.setItem("role", response.role)
          sessionStorage.setItem("username", response.username)
        })
      )
  }

  logout(): void {
    sessionStorage.clear();
    console.log('✅ Logout realizado');
    this.router.navigate(['/login']);
  }

}
