import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private endpoint = 'vendas';

  constructor(private apiService: ApiService) {}

  getVendas(): Observable<Venda[]> {
    return this.apiService.get<Venda[]>(this.endpoint);
  }

  getVendaById(id: number): Observable<Venda> {
    return this.apiService.getById<Venda>(this.endpoint, id);
  }

  createVenda(venda: Venda): Observable<Venda> {
    return this.apiService.post<Venda>(this.endpoint, venda);
  }

  updateVenda(id: number, venda: Venda): Observable<Venda> {
    return this.apiService.put<Venda>(this.endpoint, id, venda);
  }

  deleteVenda(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}