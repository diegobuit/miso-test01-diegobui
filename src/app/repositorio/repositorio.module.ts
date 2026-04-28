import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RepositorioListComponent } from './components/repositorio-list/repositorio-list.component';
import { RepositorioDetailComponent } from './components/repositorio-detail/repositorio-detail.component';

@NgModule({
  imports: [
    RepositorioListComponent,
    RouterModule.forChild([
      {
        path: '',
        component: RepositorioListComponent,
        children: [
          { path: ':id', component: RepositorioDetailComponent }
        ]
      }
    ])
  ]
})
export class RepositorioModule {}
