import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RegisterResponse} from '../types/register-response.type';
import {Observable} from 'rxjs';

export interface UserResponseDTO {
  id: number;
  role: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean;
  registeredAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = "http://localhost:8082/api/users";

  constructor(private httpClient: HttpClient) { }

  register(
    password: string,
    role: string,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
    city: string,
    uf: string
  ) {
    return this.httpClient.post<RegisterResponse>(this.apiUrl, {
      password, role, name, phoneNumber, email, address, city, uf
    })
  }

  listAll(): Observable<UserResponseDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<UserResponseDTO[]>(this.apiUrl, { headers });
  }

}
