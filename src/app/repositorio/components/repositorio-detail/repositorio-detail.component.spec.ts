import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { RepositorioDetailComponent } from './repositorio-detail.component';
import { RepositorioService } from '../../services/repositorio.service';
import { Repositorio } from '../../models/repositorio';

const mockRepo = new Repositorio(101, 'repo-101', 'Angular project', 'TypeScript', 50, '2025-01-01', 1);

describe('RepositorioDetailComponent', () => {
  let component: RepositorioDetailComponent;
  let fixture: ComponentFixture<RepositorioDetailComponent>;
  let getByIdFn: ReturnType<typeof vi.fn>;
  let navigateFn: ReturnType<typeof vi.fn>;
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    getByIdFn       = vi.fn().mockReturnValue(of(mockRepo));
    navigateFn      = vi.fn();
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: '101' }));

    await TestBed.configureTestingModule({
      imports: [RepositorioDetailComponent],
      providers: [
        { provide: RepositorioService, useValue: { getRepositorioById: getByIdFn } },
        { provide: Router,             useValue: { navigate: navigateFn } },
        { provide: ActivatedRoute,     useValue: { paramMap: paramMapSubject.asObservable() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture   = TestBed.createComponent(RepositorioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el repositorio desde el parámetro de ruta :id', () => {
    expect(getByIdFn).toHaveBeenCalledWith(101);
    expect(component.repositorio).toEqual(mockRepo);
  });

  it('debería mostrar los datos del repositorio en la vista', () => {
    const html = (fixture.nativeElement as HTMLElement).textContent!;
    expect(html).toContain('repo-101');
    expect(html).toContain('Angular project');
    expect(html).toContain('TypeScript');
    expect(html).toContain('50');
  });

  it('debería establecer notFound=true cuando el repositorio no existe', () => {
    getByIdFn.mockReturnValue(of(undefined));
    paramMapSubject.next(convertToParamMap({ id: '999' }));

    expect(component.notFound).toBe(true);
    expect(component.repositorio).toBeNull();
  });

  it('irAUsuario debería navegar a /usuarios con queryParam userId', () => {
    component.irAUsuario(1);
    expect(navigateFn).toHaveBeenCalledWith(
      ['/usuarios'],
      { queryParams: { userId: 1 } }
    );
  });

  it('irAUsuario debería pasar el ownerId correcto como queryParam', () => {
    component.irAUsuario(21);
    expect(navigateFn).toHaveBeenCalledWith(
      ['/usuarios'],
      { queryParams: { userId: 21 } }
    );
  });

  it('getLanguageColor debería retornar el color correcto para TypeScript', () => {
    expect(component.getLanguageColor('TypeScript')).toBe('#3178c6');
  });

  it('getLanguageColor debería retornar color por defecto para lenguaje desconocido', () => {
    expect(component.getLanguageColor('Desconocido')).toBe('#8b949e');
  });

  it('debería recargar el repositorio cuando cambia el parámetro :id', () => {
    const mockRepo2 = new Repositorio(102, 'repo-102', 'NestJS API', 'TypeScript', 40, '2025-01-05', 1);
    getByIdFn.mockReturnValue(of(mockRepo2));

    paramMapSubject.next(convertToParamMap({ id: '102' }));

    expect(getByIdFn).toHaveBeenCalledWith(102);
    expect(component.repositorio?.id).toBe(102);
  });
});
