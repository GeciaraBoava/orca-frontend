import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface MaterialResponseDTO {
  id?: number;
  description: string;
  materialTypeId: number;
  materialTypeDescription: string;
  unitMeasureId: number;
  unitMeasureDescription: string;
  currentPrice: number;
  active: boolean;
  registeredAt: Date;
  updatedAt: Date;
}

export interface MaterialRequestDTO {
  description: string;
  materialTypeId: number;
  unitMeasureId: number;
  currentPrice: number;
}

export interface MaterialUpdateDTO {
  description: string;
  materialTypeId: number;
  unitMeasureId: number;
  currentPrice: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  apiUrl: string = "http://localhost:8082/api/materials";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<MaterialResponseDTO[]> {
    return this.httpClient.get<MaterialResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: MaterialRequestDTO): Observable<MaterialResponseDTO> {
    return this.httpClient.post<MaterialResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: MaterialUpdateDTO): Observable<MaterialResponseDTO> {
    return this.httpClient.put<MaterialResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
