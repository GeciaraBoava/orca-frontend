import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface UnitMeasureResponseDTO {
  id?: number;
  name: string;
  description: string;
  active: boolean;
  registeredAt?: Date;
  updatedAt?: Date;
}

export interface UnitMeasureRequestDTO {
  name: string;
  description: string;
}

export interface UnitMeasureUpdateDTO {
  name: string;
  description: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UnitMeasureService {
  apiUrl: string = "http://localhost:8082/config/unit-measures";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<UnitMeasureResponseDTO[]> {
    return this.httpClient.get<UnitMeasureResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  save(dto: UnitMeasureRequestDTO): Observable<UnitMeasureResponseDTO> {
    return this.httpClient.post<UnitMeasureResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: UnitMeasureUpdateDTO): Observable<UnitMeasureResponseDTO> {
    return this.httpClient.put<UnitMeasureResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }
}
