import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { UsuarioListComponent } from './usuario-list.component';
import { UsuarioDetailComponent } from '../../components/usuario-detail/usuario-detail.component';
import { UsuarioService } from '../../services/usuario.service';
import { SearchService } from '../../../services/search.service';
import { Usuario } from '../../models/usuario';

const mockUsuarios: Usuario[] = [
  new Usuario(1, 'user1', 'User One',   'u1@mail.com', 'url1', 'admin',     'Bogotá',   [101]),
  new Usuario(2, 'user2', 'User Two',   'u2@mail.com', 'url2', 'developer', 'Medellín', [103]),
  new Usuario(3, 'user3', 'Ana García', 'u3@mail.com', 'url3', 'designer',  'Cali',     []),
];

const buildModule = (queryParams: Record<string, string> = {}) => ({
  imports: [UsuarioListComponent, UsuarioDetailComponent],
  providers: [
    { provide: UsuarioService, useValue: { getUsuarios: vi.fn().mockReturnValue(of(mockUsuarios)) } },
    { provide: SearchService,  useValue: { term$: new BehaviorSubject(''), setTerm: vi.fn() } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParams } } },
    { provide: Router,         useValue: { navigate: vi.fn() } }
  ]
});

describe('UsuarioListComponent', () => {
  let component: UsuarioListComponent;
  let fixture: ComponentFixture<UsuarioListComponent>;
  let termSubject: BehaviorSubject<string>;
  let usuarioServiceMock: { getUsuarios: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    termSubject        = new BehaviorSubject<string>('');
    usuarioServiceMock = { getUsuarios: vi.fn().mockReturnValue(of(mockUsuarios)) };

    await TestBed.configureTestingModule({
      imports: [UsuarioListComponent, UsuarioDetailComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: SearchService,  useValue: { term$: termSubject, setTerm: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: Router,         useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar al servicio de usuarios en ngOnInit', () => {
    expect(usuarioServiceMock.getUsuarios).toHaveBeenCalled();
  });

  it('debería cargar todos los usuarios al inicializar', () => {
    expect(component.usuarios.length).toBe(3);
    expect(component.filteredUsuarios.length).toBe(3);
  });

  it('debería filtrar usuarios por nombre', () => {
    termSubject.next('Ana');
    expect(component.filteredUsuarios.length).toBe(1);
    expect(component.filteredUsuarios[0].name).toBe('Ana García');
  });

  it('debería filtrar usuarios por username', () => {
    termSubject.next('user2');
    expect(component.filteredUsuarios.length).toBe(1);
    expect(component.filteredUsuarios[0].username).toBe('user2');
  });

  it('debería restaurar todos cuando el término queda vacío', () => {
    termSubject.next('user1');
    termSubject.next('');
    expect(component.filteredUsuarios.length).toBe(3);
  });

  it('debería retornar lista vacía cuando el término no coincide', () => {
    termSubject.next('zzznomatch');
    expect(component.filteredUsuarios.length).toBe(0);
  });

  it('debería seleccionar un usuario al llamar selectUsuario', () => {
    expect(component.selectedUsuario).toBeNull();
    component.selectUsuario(mockUsuarios[0]);
    expect(component.selectedUsuario).toEqual(mockUsuarios[0]);
  });

  it('debería activar showDetail al seleccionar un usuario', () => {
    expect(component.showDetail).toBe(false);
    component.selectUsuario(mockUsuarios[1]);
    expect(component.showDetail).toBe(true);
  });

  it('debería ocultar el detalle al llamar goBack', () => {
    component.selectUsuario(mockUsuarios[0]);
    component.goBack();
    expect(component.showDetail).toBe(false);
  });
});

// Suite con queryParam userId 
describe('UsuarioListComponent (con queryParam userId)', () => {
  let fixture: ComponentFixture<UsuarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(buildModule({ userId: '2' })).compileComponents();
    fixture = TestBed.createComponent(UsuarioListComponent);
    fixture.detectChanges();
  });

  it('debería auto-seleccionar usuario cuando hay queryParam userId', () => {
    expect(fixture.componentInstance.selectedUsuario?.id).toBe(2);
    expect(fixture.componentInstance.showDetail).toBe(true);
  });
});
