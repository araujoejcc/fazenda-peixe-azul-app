import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CicloProducao } from '../models/ciclo-producao.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CicloProducaoService {
  private endpoint = 'ciclos-producao';

  constructor(private apiService: ApiService) {}

  getCiclos(): Observable<CicloProducao[]> {
    return this.apiService.get<CicloProducao[]>(this.endpoint);
  }

  getCicloById(id: number): Observable<CicloProducao> {
    return this.apiService.getById<CicloProducao>(this.endpoint, id);
  }

  createCiclo(ciclo: CicloProducao): Observable<CicloProducao> {
    return this.apiService.post<CicloProducao>(this.endpoint, ciclo);
  }

  updateCiclo(id: number, ciclo: CicloProducao): Observable<CicloProducao> {
    return this.apiService.put<CicloProducao>(this.endpoint, id, ciclo);
  }

  deleteCiclo(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}