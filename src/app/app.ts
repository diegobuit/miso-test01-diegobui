import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  isDark      = false;
  sidebarOpen = false;
  searchTerm  = '';

  private searchService      = inject(SearchService);
  private usuarioService     = inject(UsuarioService);
  private repositorioService = inject(RepositorioService);
  private router             = inject(Router);

  constructor() {
    this.usuarioService.getUsuarios().subscribe();
    this.repositorioService.getRepositorios().subscribe();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.searchTerm = '';
      this.searchService.setTerm('');
    });
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
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.searchService.setTerm(this.searchTerm);
  }
}
