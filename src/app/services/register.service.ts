import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegisterResponse} from '../types/register-response.type';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
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
    return this.httpClient.post<RegisterResponse>(this.apiUrl + "/save", {
      password, role, name, phoneNumber, email, address, city, uf
    })
  }

}
