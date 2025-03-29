import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private endpoint = 'compras';

  constructor(private apiService: ApiService) {}

  getCompras(): Observable<Compra[]> {
    return this.apiService.get<Compra[]>(this.endpoint);
  }

  getCompraById(id: number): Observable<Compra> {
    return this.apiService.getById<Compra>(this.endpoint, id);
  }

  createCompra(compra: Compra): Observable<Compra> {
    return this.apiService.post<Compra>(this.endpoint, compra);
  }

  updateCompra(id: number, compra: Compra): Observable<Compra> {
    return this.apiService.put<Compra>(this.endpoint, id, compra);
  }

  deleteCompra(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}