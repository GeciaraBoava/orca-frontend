import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface SupplierResponseDTO {
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
  registeredAt?: Date;
  updatedAt?: Date;
}

export interface SupplierRequestDTO {
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  contactName: string;
  email: string;
  address: string;
  city: string;
  uf: string;
}

export interface SupplierUpdateDTO {
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  contactName: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  apiUrl: string = "http://localhost:8082/api/suppliers";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<SupplierResponseDTO[]> {
    return this.httpClient.get<SupplierResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: SupplierRequestDTO): Observable<SupplierResponseDTO> {
    return this.httpClient.post<SupplierResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: SupplierUpdateDTO): Observable<SupplierResponseDTO> {
    return this.httpClient.put<SupplierResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
