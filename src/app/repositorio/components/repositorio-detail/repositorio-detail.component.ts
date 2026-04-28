import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repositorio } from '../../models/repositorio';
import { RepositorioService } from '../../services/repositorio.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-repositorio-detail',
  templateUrl: './repositorio-detail.component.html',
  styleUrl: './repositorio-detail.component.css'
})
export class RepositorioDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private repositorioService = inject(RepositorioService);

  repositorio: Repositorio | null = null;
  notFound = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.repositorioService.getRepositorioById(id)),
      takeUntil(this.destroy$)
    ).subscribe(repo => {
      this.repositorio = repo ?? null;
      this.notFound = !repo;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
      'Java': '#b07219',       'Go': '#00ADD8',          'Rust': '#dea584',
      'HTML': '#e34c26',       'CSS': '#563d7c',          'Shell': '#89e051',
      'Kotlin': '#A97BFF',     'Swift': '#F05138',        'C++': '#f34b7d',
      'C#': '#178600',         'Ruby': '#701516',         'YAML': '#cb171e',
    };
    return colors[language] ?? '#8b949e';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
