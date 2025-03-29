import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tanque } from '../models/tanque.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TanqueService {
  private endpoint = 'tanques';

  constructor(private apiService: ApiService) {}

  getTanques(): Observable<Tanque[]> {
    return this.apiService.get<Tanque[]>(this.endpoint);
  }

  getTanqueById(id: number): Observable<Tanque> {
    return this.apiService.getById<Tanque>(this.endpoint, id);
  }

  createTanque(tanque: Tanque): Observable<Tanque> {
    return this.apiService.post<Tanque>(this.endpoint, tanque);
  }

  updateTanque(id: number, tanque: Tanque): Observable<Tanque> {
    return this.apiService.put<Tanque>(this.endpoint, id, tanque);
  }

  deleteTanque(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }
}