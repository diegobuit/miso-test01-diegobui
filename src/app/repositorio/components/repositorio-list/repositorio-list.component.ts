import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, combineLatest, filter, takeUntil } from 'rxjs';
import { Repositorio } from '../../models/repositorio';
import { RepositorioService } from '../../services/repositorio.service';
import { SearchService } from '../../../services/search.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-repositorio-list',
  templateUrl: './repositorio-list.component.html',
  styleUrl: './repositorio-list.component.css'
})
export class RepositorioListComponent implements OnInit, OnDestroy {
  private repositorioService = inject(RepositorioService);
  private searchService      = inject(SearchService);
  private route              = inject(ActivatedRoute);
  private router             = inject(Router);

  repositorios: Repositorio[]         = [];
  filteredRepositorios: Repositorio[] = [];
  sortBy       = 'stars';
  hasSelection = false;
  showDetail   = false;

  private destroy$ = new Subject<void>();

  get totalStars(): number {
    return this.repositorios.reduce((sum, r) => sum + r.stars, 0);
  }

  get uniqueLanguages(): number {
    return new Set(this.repositorios.map(r => r.language)).size;
  }

  ngOnInit(): void {
    combineLatest([
      this.repositorioService.getRepositorios(),
      this.searchService.term$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([data, term]) => {
        this.repositorios = data;
        const filtered = term
          ? data.filter(r =>
              r.name.toLowerCase().includes(term.toLowerCase()) ||
              r.description.toLowerCase().includes(term.toLowerCase()) ||
              r.language.toLowerCase().includes(term.toLowerCase())
            )
          : [...data];
        this.filteredRepositorios = this.sortRepos(filtered);
      });

    this.updateSelection();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => this.updateSelection());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSelection(): void {
    this.hasSelection = !!this.route.firstChild;
    if (this.hasSelection) this.showDetail = true;
  }

  private sortRepos(repos: Repositorio[]): Repositorio[] {
    return repos.sort((a, b) => {
      if (this.sortBy === 'stars') return b.stars - a.stars;
      if (this.sortBy === 'date')  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.name.localeCompare(b.name);
    });
  }

  setSort(value: string): void {
    this.sortBy = value;
    this.filteredRepositorios = this.sortRepos([...this.filteredRepositorios]);
  }

  onSelectRepo(): void {
    this.showDetail = true;
  }

  goBack(): void {
    this.showDetail = false;
    this.router.navigate(['/repositorios']);
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
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
