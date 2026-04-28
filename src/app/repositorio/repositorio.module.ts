import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositorioRoutingModule } from './repositorio-routing.module';
import { RepositorioListComponent } from './components/repositorio-list/repositorio-list.component';

@NgModule({
  declarations: [
    RepositorioListComponent
  ],
  imports: [
    CommonModule,
    RepositorioRoutingModule
  ]
})
export class RepositorioModule {}
