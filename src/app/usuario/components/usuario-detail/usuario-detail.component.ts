import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  standalone: false,
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrl: './usuario-detail.component.css'
})
export class UsuarioDetailComponent {
  @Input() usuario: Usuario | null = null;

  private router = inject(Router);

  irARepositorio(repoId: number): void {
    this.router.navigate(['/repositorios', repoId]);
  }
}
