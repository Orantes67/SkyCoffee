// src/app/core/services/Usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/ usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/Usuarios';

  constructor(private http: HttpClient) {}

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(Usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, Usuario);
  }

  updateUsuario(id: number, Usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, Usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadProfilePicture(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(`${this.apiUrl}/upload`, formData);
  }
}