import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Repositorio } from '../models/repositorio';

@Injectable({
  providedIn: 'root'
})
export class RepositorioService {
  private readonly apiUrl = 'https://gist.githubusercontent.com/caev03/628509e0b3fe41dd44f6a2ab09d81ef9/raw/f847eafbecca47287ff0faec4de1329b874f5711/repositories.json';

  private repositorios$: Observable<Repositorio[]>;

  constructor(private http: HttpClient) {
    this.repositorios$ = this.http.get<Repositorio[]>(this.apiUrl).pipe(
      shareReplay(1)
    );
  }

  getRepositorios(): Observable<Repositorio[]> {
    return this.repositorios$;
  }

  getRepositorioById(id: number): Observable<Repositorio | undefined> {
    return this.repositorios$.pipe(
      map(repos => repos.find(r => r.id === id))
    );
  }
}
