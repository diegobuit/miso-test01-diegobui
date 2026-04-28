import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'https://gist.githubusercontent.com/caev03/628509e0b3fe41dd44f6a2ab09d81ef9/raw/f847eafbecca47287ff0faec4de1329b874f5711/users.json';

  private usuarios$: Observable<Usuario[]>;

  constructor(private http: HttpClient) {
    this.usuarios$ = this.http.get<Usuario[]>(this.apiUrl).pipe(shareReplay(1));
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios$;
  }
}
