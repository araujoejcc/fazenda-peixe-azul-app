import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Tanques', icon: 'pool', route: '/tanques' },
    { name: 'Ciclos de Produção', icon: 'sync', route: '/ciclos-producao' },
    { name: 'Qualidade da Água', icon: 'opacity', route: '/qualidade-agua' },
    { name: 'Financeiro', icon: 'attach_money', route: '/financeiro' },
    { name: 'Relatórios', icon: 'assessment', route: '/relatorios' }
  ];
}