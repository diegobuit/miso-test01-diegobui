import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepositorioListComponent } from './components/repositorio-list/repositorio-list.component';

const routes: Routes = [
  { path: '', component: RepositorioListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositorioRoutingModule {}
