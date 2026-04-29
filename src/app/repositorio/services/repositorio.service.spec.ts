import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { RepositorioService } from './repositorio.service';
import { Repositorio } from '../models/repositorio';

const API_URL = 'https://gist.githubusercontent.com/caev03/628509e0b3fe41dd44f6a2ab09d81ef9/raw/f847eafbecca47287ff0faec4de1329b874f5711/repositories.json';

const mockRepos: Repositorio[] = [
  new Repositorio(101, 'repo-101', 'Angular project', 'TypeScript', 50,  '2025-01-01', 1),
  new Repositorio(102, 'repo-102', 'NestJS API',      'TypeScript', 40,  '2025-01-05', 1),
  new Repositorio(113, 'repo-113', 'Data scripts',    'Python',     90,  '2025-02-25', 9),
  new Repositorio(130, 'repo-130', 'Search engine',   'Java',       140, '2025-04-15', 21),
];

describe('RepositorioService', () => {
  let service: RepositorioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepositorioService, provideHttpClient(), provideHttpClientTesting()]
    });
    service  = TestBed.inject(RepositorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer GET a la URL correcta', () => {
    service.getRepositorios().subscribe();
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('debería retornar la lista completa de repositorios', () => {
    let result: Repositorio[] = [];
    service.getRepositorios().subscribe(r => result = r);
    httpMock.expectOne(API_URL).flush(mockRepos);
    expect(result.length).toBe(4);
  });

  it('debería mapear correctamente todos los atributos de Repositorio', () => {
    let result: Repositorio[] = [];
    service.getRepositorios().subscribe(r => result = r);
    httpMock.expectOne(API_URL).flush(mockRepos);

    const r = result[0];
    expect(r.id).toBe(101);
    expect(r.name).toBe('repo-101');
    expect(r.description).toBe('Angular project');
    expect(r.language).toBe('TypeScript');
    expect(r.stars).toBe(50);
    expect(r.createdAt).toBe('2025-01-01');
    expect(r.ownerId).toBe(1);
  });

  it('getRepositorioById debería retornar el repo con el ID correcto', () => {
    let result: Repositorio | undefined;
    service.getRepositorioById(113).subscribe(r => result = r);
    httpMock.expectOne(API_URL).flush(mockRepos);

    expect(result).toBeDefined();
    expect(result!.id).toBe(113);
    expect(result!.name).toBe('repo-113');
    expect(result!.language).toBe('Python');
  });

  it('getRepositorioById debería retornar undefined para un ID inexistente', () => {
    let result: Repositorio | undefined = {} as Repositorio;
    service.getRepositorioById(999).subscribe(r => result = r);
    httpMock.expectOne(API_URL).flush(mockRepos);
    expect(result).toBeUndefined();
  });

  it('shareReplay: múltiples suscripciones solo hacen UNA petición HTTP', () => {
    service.getRepositorios().subscribe();
    service.getRepositorios().subscribe();

    const reqs = httpMock.match(API_URL);
    expect(reqs.length).toBe(1);
    reqs[0].flush(mockRepos);
  });

  it('getRepositorioById y getRepositorios comparten el mismo caché HTTP', () => {
    service.getRepositorios().subscribe();
    service.getRepositorioById(101).subscribe();

    const reqs = httpMock.match(API_URL);
    expect(reqs.length).toBe(1);
    reqs[0].flush(mockRepos);
  });
});
