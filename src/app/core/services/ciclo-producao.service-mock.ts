import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CicloProducao } from '../models/ciclo-producao.model';

/**
 * Serviço mock para ciclos de produção
 */
@Injectable({
  providedIn: 'root'
})
export class CicloProducaoServiceMock {
  // Dados mockados - note que estamos referenciando os IDs dos tanques
  // que definimos no TanqueServiceMock
  private ciclos: CicloProducao[] = [
    {
      id: 1,
      tanque: { id: 1, nome: 'Tanque 01', capacidade: 1000, localizacao: 'Setor A', especieCultura: 'Litopenaeus vannamei' },
      dataInicio: '2023-01-10',
      dataFim: '2023-04-15',
      quantidadePescado: 850,
      racaoGasta: 1275
    },
    {
      id: 2,
      tanque: { id: 2, nome: 'Tanque 02', capacidade: 1500, localizacao: 'Setor A', especieCultura: 'Litopenaeus vannamei' },
      dataInicio: '2023-02-05',
      dataFim: '2023-05-20',
      quantidadePescado: 1250,
      racaoGasta: 1875
    },
    {
      id: 3,
      tanque: { id: 3, nome: 'Tanque 03', capacidade: 1200, localizacao: 'Setor B', especieCultura: 'Litopenaeus vannamei' },
      dataInicio: '2023-03-15',
      // Sem data fim para simular ciclo ativo
      quantidadePescado: 0, // Ainda não houve colheita
      racaoGasta: 650
    }
  ];

  constructor() {}

  getCiclos(): Observable<CicloProducao[]> {
    return of([...this.ciclos]).pipe(delay(500));
  }

  getCicloById(id: number): Observable<CicloProducao> {
    const ciclo = this.ciclos.find(c => c.id === id);
    
    if (ciclo) {
      return of({...ciclo}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Ciclo com ID ${id} não encontrado`)).pipe(delay(500));
  }

  createCiclo(ciclo: CicloProducao): Observable<CicloProducao> {
    const newId = Math.max(...this.ciclos.map(c => c.id ?? 0)) + 1;
    const newCiclo = { ...ciclo, id: newId };
    
    this.ciclos.push(newCiclo);
    return of({...newCiclo}).pipe(delay(500));
  }

  updateCiclo(id: number, ciclo: CicloProducao): Observable<CicloProducao> {
    const index = this.ciclos.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const updatedCiclo = { ...ciclo, id };
      this.ciclos[index] = updatedCiclo;
      return of({...updatedCiclo}).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Ciclo com ID ${id} não encontrado para atualização`)).pipe(delay(500));
  }

  deleteCiclo(id: number): Observable<void> {
    const index = this.ciclos.findIndex(c => c.id === id);
    
    if (index !== -1) {
      this.ciclos.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    
    return throwError(() => new Error(`Ciclo com ID ${id} não encontrado para exclusão`)).pipe(delay(500));
  }

  // Método adicional para buscar ciclos por tanque
  getCiclosByTanqueId(tanqueId: number): Observable<CicloProducao[]> {
    const ciclosFiltrados = this.ciclos.filter(c => c.tanque.id === tanqueId);
    return of(ciclosFiltrados).pipe(delay(500));
  }
}