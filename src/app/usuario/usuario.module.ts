import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioDetailComponent } from './components/usuario-detail/usuario-detail.component';

@NgModule({
  declarations: [
    UsuarioListComponent,
    UsuarioDetailComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule {}
