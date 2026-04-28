import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SearchService } from './services/search.service';
import { UsuarioService } from './usuario/services/usuario.service';
import { RepositorioService } from './repositorio/services/repositorio.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isDark = false;
  sidebarOpen = false;

  private searchService      = inject(SearchService);
  private usuarioService     = inject(UsuarioService);
  private repositorioService = inject(RepositorioService);

  constructor() {
    // Pre-carga ambos servicios al arrancar la app para que los datos
    // estén listos (o en camino) antes de que el usuario navegue.
    this.usuarioService.getUsuarios().subscribe();
    this.repositorioService.getRepositorios().subscribe();
  }

  toggleDark(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchService.setTerm(term);
  }
}
