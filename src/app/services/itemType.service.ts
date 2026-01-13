import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ItemTypeResponseDTO {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  registeredAt?: Date;
  updatedAt?: Date;
}

export interface ItemTypeRequestDTO {
  name: string;
  description: string;
}

export interface ItemTypeUpdateDTO {
  name: string;
  description: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ItemTypeService {
  apiUrl: string = "http://localhost:8082/config/items-types";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<ItemTypeResponseDTO[]> {
    return this.httpClient.get<ItemTypeResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: ItemTypeRequestDTO): Observable<ItemTypeResponseDTO> {
    return this.httpClient.post<ItemTypeResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: ItemTypeUpdateDTO): Observable<ItemTypeResponseDTO> {
    return this.httpClient.put<ItemTypeResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
