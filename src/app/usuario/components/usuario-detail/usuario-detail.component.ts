import { Component, Input } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  standalone: false,
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrl: './usuario-detail.component.css'
})
export class UsuarioDetailComponent {
  @Input() usuario: Usuario | null = null;
}
