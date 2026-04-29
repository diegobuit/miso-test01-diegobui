import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('debería crearse el componente raíz', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería tener la propiedad isDark en false por defecto', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.isDark).toBe(false);
  });

  it('debería tener sidebarOpen en false por defecto', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.sidebarOpen).toBe(false);
  });

  it('toggleDark debería alternar isDark', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isDark).toBe(false);
    app.toggleDark();
    expect(app.isDark).toBe(true);
    app.toggleDark();
    expect(app.isDark).toBe(false);
  });

  it('toggleSidebar debería alternar sidebarOpen', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.toggleSidebar();
    expect(app.sidebarOpen).toBe(true);
    app.closeSidebar();
    expect(app.sidebarOpen).toBe(false);
  });
});
