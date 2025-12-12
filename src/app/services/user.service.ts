import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface UserResponseDTO {
  id: number;
  role: string;
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean;
  registeredAt: Date;
  updatedAt: Date;
}

export interface UserRequestDTO {
  role: string;
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  uf: string;
}

export interface UserUpdateRequestDTO {
  password: string;
  role: string;
  name: string;
  cnpjCpf: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = "http://localhost:8082/api/users";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  listAll(): Observable<UserResponseDTO[]> {
    return this.httpClient.get<UserResponseDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  find(username: string): Observable<UserResponseDTO> {
    return this.httpClient.get<UserResponseDTO>(`${this.apiUrl}/username/${username}`, { headers: this.getAuthHeaders() });
  }

  save(dto: UserRequestDTO): Observable<UserResponseDTO> {
    return this.httpClient.post<UserResponseDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
  }

  update(id: number, dto: UserUpdateRequestDTO): Observable<UserResponseDTO> {
    return this.httpClient.put<UserResponseDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
  }

  updatePassword(id: number, newPassword: string): Observable<void> {
    return this.httpClient.put<void>(
      `${this.apiUrl}/usuario/${id}/senha`,
      newPassword, { headers: this.getAuthHeaders(), responseType: 'text' as 'json' }
    );
  }
}
