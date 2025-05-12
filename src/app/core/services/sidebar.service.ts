import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SidebarState {
  collapsed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private initialState: SidebarState = {
    collapsed: false
  };

  private sidebarStateSubject = new BehaviorSubject<SidebarState>(this.initialState);
  sidebarState$ = this.sidebarStateSubject.asObservable();

  constructor() { }

  toggleSidebar(): void {
    const currentState = this.sidebarStateSubject.value;
    this.sidebarStateSubject.next({
      collapsed: !currentState.collapsed
    });
  }
}