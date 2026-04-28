import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'repositorios',
    loadChildren: () => import('./repositorio/repositorio.module').then(m => m.RepositorioModule)
  }
];
