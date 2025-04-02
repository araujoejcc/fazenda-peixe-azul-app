import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RegistroQualidadeAgua } from '../models/registro-qualidade-agua.model';

/**
 * Serviço mock para registros de qualidade da água
 */
@Injectable({
  providedIn: 'root'
})
export class QualidadeAguaServiceMock {
  // Dados mockados
  private registros: RegistroQualidadeAgua[] = [
    {
      id: 1,
      tanque: { id: 1, nome: 'Tanque 01', capacidade: 1000, localizacao: 'Setor A', especieCultura: 'Litopenaeus vannamei' },
      amonia: 0.25,
      nitrito: 0.05,
      salinidade: 12,
      turbidez: 15,
      temperatura: 28.5,
      ph: 7.8,
      oxigenacao: 5.2,
      data: '2023-04-01'
    },
    {
      id: 2,
      tanque: { id: 1, nome: 'Tanque 01', capacidade: 1000, localizacao: 'Setor A', especieCultura: 'Litopenaeus vannamei' },
      amonia: 0.30,
      nitrito: 0.06,
      salinidade: 11.8,
      turbidez: 18,
      temperatura: 29.0,
      ph: 7.6,
      oxigenacao: 5.0,
      data: '2023-04-02'
    },
    {
      id: 3,
      tanque: { id: 2, nome: 'Tanque 02', capacidade: 1500, localizacao: 'Setor A', especieCultura: 'Litopenaeus vannamei' },
      amonia: 0.15,
      nitrito: 0.04,
      salinidade: 12.5,
      turbidez: 12,
      temperatura: 28.0,
      ph: 7.9,
      oxigenacao: 5.5,
      data: '2023-04-01'
    },
    {
      id: 4,
      tanque: { id: 3, nome: 'Tanque 03', capacidade: 1200, localizacao: 'Setor B', especieCultura: 'Litopenaeus vannamei' },
      amonia: 0.20,
      nitrito: 0.05,
      salinidade: 12.2,
      turbidez: 14,
      temperatura: 28.3,
      ph: 7.7,
      oxigenacao: 5.3,
      data: '2023-04-01'
    },
    {
      id: 5,
      tanque: { id: 3, nome: 'Tanque 03', capacidade: 1200, localizacao: 'Setor B', especieCultura: 'Litopenaeus vannamei' },
      amonia: 0.22,
      nitrito: 0.06,
      salinidade: 12.0,
      turbidez: 15,
      temperatura: 28.5,
      ph: 7.6,
      oxigenacao: 5.1,
      data: '2023-04-02'
    }
  ];

  constructor() {}

  getRegistros(): Observable<RegistroQualidadeAgua[]> {
    return of([...this.registros]).pipe(delay(500));
  }

  getRegistroById(id: number): Observable<RegistroQualidadeAgua> {
    const registro = this.registros.find(r => r.id === id);
    
    if (registro) {
      return of({...registro}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Registro com ID ${id} não encontrado`)).pipe(delay(500));
  }

  createRegistro(registro: RegistroQualidadeAgua): Observable<RegistroQualidadeAgua> {
    const newId = Math.max(...this.registros.map(r => r.id ?? 0)) + 1;
    const newRegistro = { ...registro, id: newId };
    
    this.registros.push(newRegistro);
    return of({...newRegistro}).pipe(delay(500));
  }

  updateRegistro(id: number, registro: RegistroQualidadeAgua): Observable<RegistroQualidadeAgua> {
    const index = this.registros.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const updatedRegistro = { ...registro, id };
      this.registros[index] = updatedRegistro;
      return of({...updatedRegistro}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Registro com ID ${id} não encontrado para atualização`)).pipe(delay(500));
  }

  deleteRegistro(id: number): Observable<void> {
    const index = this.registros.findIndex(r => r.id === id);
    
    if (index !== -1) {
      this.registros.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Registro com ID ${id} não encontrado para exclusão`)).pipe(delay(500));
  }

  // Método adicional para buscar registros por tanque
  getRegistrosByTanqueId(tanqueId: number): Observable<RegistroQualidadeAgua[]> {
    const registrosFiltrados = this.registros.filter(r => r.tanque.id === tanqueId);
    return of(registrosFiltrados).pipe(delay(500));
  }
}