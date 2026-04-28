import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepositorioListComponent } from './components/repositorio-list/repositorio-list.component';
import { RepositorioDetailComponent } from './components/repositorio-detail/repositorio-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RepositorioListComponent,
    children: [
      { path: ':id', component: RepositorioDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepositorioRoutingModule {}
