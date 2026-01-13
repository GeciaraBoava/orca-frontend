import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface MaterialTypeResponseDTO {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  registeredAt?: Date;
  updatedAt?: Date;
}

export interface MaterialTypeRequestDTO {
  name: string;
  description: string;
}

export interface MaterialTypeUpdateDTO {
  name: string;
  description: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialTypeService {
  apiUrl: string = "http://localhost:8082/config/material-types";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<MaterialTypeResponseDTO[]> {
    return this.httpClient.get<MaterialTypeResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: MaterialTypeRequestDTO): Observable<MaterialTypeResponseDTO> {
    return this.httpClient.post<MaterialTypeResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: MaterialTypeUpdateDTO): Observable<MaterialTypeResponseDTO> {
    return this.httpClient.put<MaterialTypeResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
