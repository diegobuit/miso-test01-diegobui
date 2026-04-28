import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { SearchService } from '../../../services/search.service';

@Component({
  standalone: false,
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements OnInit, OnDestroy {
  private usuarioService = inject(UsuarioService);
  private searchService = inject(SearchService);

  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  showDetail = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      this.filteredUsuarios = data;
    });

    this.searchService.term$.pipe(takeUntil(this.destroy$)).subscribe((term: string) => {
      this.filteredUsuarios = term
        ? this.usuarios.filter(u =>
            u.name.toLowerCase().includes(term.toLowerCase()) ||
            u.username.toLowerCase().includes(term.toLowerCase())
          )
        : this.usuarios;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.showDetail = true;
  }

  goBack(): void {
    this.showDetail = false;
  }
}
