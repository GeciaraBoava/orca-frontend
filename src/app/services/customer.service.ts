import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface CustomerResponseDTO {
  id?: number;
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  contactName: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean;
  customerType: string;
  registeredAt?: Date;
  updatedAt?: Date;
}

export interface CustomerRequestDTO {
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  contactName: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  customerType: string;
}

export interface CustomerUpdateRequestDTO {
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  contactName: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  customerType: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiUrl: string = "http://localhost:8082/api/customers";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<CustomerResponseDTO[]> {
    return this.httpClient.get<CustomerResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: CustomerRequestDTO): Observable<CustomerResponseDTO> {
    return this.httpClient.post<CustomerResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: CustomerUpdateRequestDTO): Observable<CustomerResponseDTO> {
    return this.httpClient.put<CustomerResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
