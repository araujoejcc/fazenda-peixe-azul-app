import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroQualidadeAgua } from '../models/registro-qualidade-agua.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QualidadeAguaService {
  private endpoint = 'registros-qualidade-agua';

  constructor(private apiService: ApiService) {}

  getRegistros(): Observable<RegistroQualidadeAgua[]> {
    return this.apiService.get<RegistroQualidadeAgua[]>(this.endpoint);
  }

  getRegistroById(id: number): Observable<RegistroQualidadeAgua> {
    return this.apiService.getById<RegistroQualidadeAgua>(this.endpoint, id);
  }

  createRegistro(registro: RegistroQualidadeAgua): Observable<RegistroQualidadeAgua> {
    return this.apiService.post<RegistroQualidadeAgua>(this.endpoint, registro);
  }

  updateRegistro(id: number, registro: RegistroQualidadeAgua): Observable<RegistroQualidadeAgua> {
    return this.apiService.put<RegistroQualidadeAgua>(this.endpoint, id, registro);
  }

  deleteRegistro(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}