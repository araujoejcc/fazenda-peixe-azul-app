import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isMobile = false;
  
  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Tanques', icon: 'waves', route: '/tanques' },
    { name: 'Ciclos de Produção', icon: 'sync', route: '/ciclos-producao' },
    { name: 'Qualidade da Água', icon: 'opacity', route: '/qualidade-agua' },
    { name: 'Financeiro', icon: 'attach_money', route: '/financeiro' },
    { name: 'Relatórios', icon: 'assessment', route: '/relatorios' }
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Verifica se é dispositivo móvel no carregamento da página
    this.checkScreenSize();
    
    // Adiciona um listener para detectar alterações no tamanho da tela
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    
    // Inscreve-se para receber atualizações do estado do sidebar
    this.sidebarService.sidebarState$.subscribe(state => {
      this.isCollapsed = state.collapsed;
      
      // No mobile, o sidebar começa fechado e só é aberto quando o toggle é clicado
      if (this.isMobile) {
        document.querySelector('.sidebar')?.classList.toggle('open', !state.collapsed);
      }
    });
  }

  // Verifica o tamanho da tela para determinar se é mobile
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    // Em dispositivos móveis, o sidebar começa colapsado
    if (this.isMobile && !this.isCollapsed) {
      this.sidebarService.toggleSidebar();
    }
  }
}