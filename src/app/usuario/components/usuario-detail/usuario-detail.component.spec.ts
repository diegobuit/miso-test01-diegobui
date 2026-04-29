import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioDetailComponent } from './usuario-detail.component';
import { Usuario } from '../../models/usuario';

const mockUsuario = new Usuario(
  1, 'user1', 'User One', 'user1@mail.com',
  'https://i.pravatar.cc/150?img=1', 'admin', 'Bogotá', [101, 102]
);

describe('UsuarioDetailComponent', () => {
  let component: UsuarioDetailComponent;
  let fixture: ComponentFixture<UsuarioDetailComponent>;
  let navigateFn: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    navigateFn = vi.fn();

    await TestBed.configureTestingModule({
      imports: [UsuarioDetailComponent],
      providers: [
        { provide: Router, useValue: { navigate: navigateFn } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuarioDetailComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería iniciar con usuario nulo (sin selección)', () => {
    fixture.detectChanges();
    expect(component.usuario).toBeNull();
  });

  it('debería mostrar el estado vacío cuando usuario es null', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Selecciona un usuario');
  });

  it('debería mostrar los datos del usuario cuando recibe @Input', () => {
    component.usuario = mockUsuario;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('User One');
    expect(compiled.textContent).toContain('user1@mail.com');
    expect(compiled.textContent).toContain('admin');
    expect(compiled.textContent).toContain('Bogotá');
  });

  it('debería mostrar los IDs de repositorios del usuario', () => {
    component.usuario = mockUsuario;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('#101');
    expect(compiled.textContent).toContain('#102');
  });

  it('irARepositorio debería navegar a /repositorios/:id', () => {
    fixture.detectChanges();
    component.irARepositorio(101);
    expect(navigateFn).toHaveBeenCalledWith(['/repositorios', 101]);
  });

  it('irARepositorio debería navegar con el ID correcto del parámetro', () => {
    fixture.detectChanges();
    component.irARepositorio(202);
    expect(navigateFn).toHaveBeenCalledWith(['/repositorios', 202]);
  });

  it('debería renderizar el nombre correcto cuando @Input cambia entre usuarios', () => {
    const otroUsuario = new Usuario(
      5, 'user5', 'User Five', 'user5@mail.com',
      'url5', 'developer', 'Cartagena', [107]
    );
    component.usuario = otroUsuario;
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('User Five');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('user5@mail.com');
  });
});
