import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
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
  private searchService  = inject(SearchService);
  private route          = inject(ActivatedRoute);

  usuarios: Usuario[]         = [];
  filteredUsuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  showDetail = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    combineLatest([
      this.usuarioService.getUsuarios(),
      this.searchService.term$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([data, term]) => {
        this.usuarios = data;
        this.filteredUsuarios = term
          ? data.filter(u =>
              u.name.toLowerCase().includes(term.toLowerCase()) ||
              u.username.toLowerCase().includes(term.toLowerCase())
            )
          : data;

        // Auto-selecciona usuario si viene desde detalle de repositorio
        const userId = this.route.snapshot.queryParams['userId'];
        if (userId && !this.selectedUsuario) {
          const usuario = data.find(u => u.id === Number(userId));
          if (usuario) this.selectUsuario(usuario);
        }
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
