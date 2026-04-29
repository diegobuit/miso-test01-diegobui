import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario';

const API_URL = 'https://gist.githubusercontent.com/caev03/628509e0b3fe41dd44f6a2ab09d81ef9/raw/f847eafbecca47287ff0faec4de1329b874f5711/users.json';

const mockUsuarios: Usuario[] = [
  new Usuario(1, 'user1', 'User One',   'user1@mail.com', 'url1', 'admin',     'Bogotá',   [101, 102]),
  new Usuario(2, 'user2', 'User Two',   'user2@mail.com', 'url2', 'developer', 'Medellín', [103]),
  new Usuario(3, 'user3', 'User Three', 'user3@mail.com', 'url3', 'designer',  'Cali',     []),
];

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioService, provideHttpClient(), provideHttpClientTesting()]
    });
    service  = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer GET a la URL correcta del enunciado', () => {
    service.getUsuarios().subscribe();
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });

  it('debería retornar la lista completa de usuarios', () => {
    let result: Usuario[] = [];
    service.getUsuarios().subscribe(u => result = u);
    httpMock.expectOne(API_URL).flush(mockUsuarios);
    expect(result.length).toBe(3);
  });

  it('debería mapear correctamente todos los atributos del Usuario', () => {
    let result: Usuario[] = [];
    service.getUsuarios().subscribe(u => result = u);
    httpMock.expectOne(API_URL).flush(mockUsuarios);

    const u = result[0];
    expect(u.id).toBe(1);
    expect(u.username).toBe('user1');
    expect(u.name).toBe('User One');
    expect(u.email).toBe('user1@mail.com');
    expect(u.role).toBe('admin');
    expect(u.location).toBe('Bogotá');
    expect(u.repoIds).toEqual([101, 102]);
  });

  it('shareReplay: múltiples suscripciones solo hacen UNA petición HTTP', () => {
    service.getUsuarios().subscribe();
    service.getUsuarios().subscribe();

    const reqs = httpMock.match(API_URL);
    expect(reqs.length).toBe(1);
    reqs[0].flush(mockUsuarios);
  });

  it('shareReplay: segunda suscripción recibe datos en caché sin nueva petición', () => {
    service.getUsuarios().subscribe();
    httpMock.expectOne(API_URL).flush(mockUsuarios);

    let result: Usuario[] = [];
    service.getUsuarios().subscribe(u => result = u);
    httpMock.expectNone(API_URL);
    expect(result.length).toBe(3);
  });
});
