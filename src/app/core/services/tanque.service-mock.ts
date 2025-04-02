import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tanque } from '../models/tanque.model';

/**
 * Serviço mock para tanques que simula operações CRUD
 */
@Injectable({
  providedIn: 'root'
})
export class TanqueServiceMock {
  // Dados mockados
  private tanques: Tanque[] = [
    {
      id: 1,
      nome: 'Tanque 01',
      capacidade: 1000,
      localizacao: 'Setor A',
      especieCultura: 'Litopenaeus vannamei'
    },
    {
      id: 2,
      nome: 'Tanque 02',
      capacidade: 1500,
      localizacao: 'Setor A',
      especieCultura: 'Litopenaeus vannamei'
    },
    {
      id: 3,
      nome: 'Tanque 03',
      capacidade: 1200,
      localizacao: 'Setor B',
      especieCultura: 'Litopenaeus vannamei'
    }
  ];

  constructor() {}

  getTanques(): Observable<Tanque[]> {
    return of([...this.tanques]).pipe(delay(500));
  }

  getTanqueById(id: number): Observable<Tanque> {
    const tanque = this.tanques.find(t => t.id === id);
    
    if (tanque) {
      return of({...tanque}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Tanque com ID ${id} não encontrado`)).pipe(delay(500));
  }

  createTanque(tanque: Tanque): Observable<Tanque> {
    // Simular geração de ID
    const newId = Math.max(...this.tanques.map(t => t.id ?? 0)) + 1;
    const newTanque = { ...tanque, id: newId };
    
    this.tanques.push(newTanque);
    return of({...newTanque}).pipe(delay(500));
  }

  updateTanque(id: number, tanque: Tanque): Observable<Tanque> {
    const index = this.tanques.findIndex(t => t.id === id);
    
    if (index !== -1) {
      const updatedTanque = { ...tanque, id };
      this.tanques[index] = updatedTanque;
      return of({...updatedTanque}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Tanque com ID ${id} não encontrado para atualização`)).pipe(delay(500));
  }

  deleteTanque(id: number): Observable<void> {
    const index = this.tanques.findIndex(t => t.id === id);
    
    if (index !== -1) {
      this.tanques.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Tanque com ID ${id} não encontrado para exclusão`)).pipe(delay(500));
  }
}