import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {DefaultHomeLayoutComponent} from '../default-home-layout/default-home-layout.component';

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

describe('DefaultHomeLayoutComponent', () => {
  let component: DefaultHomeLayoutComponent;
  let fixture: ComponentFixture<DefaultHomeLayoutComponent>;
  let router: RouterMock;

  beforeEach(async () => {
    router = new RouterMock();

    await TestBed.configureTestingModule({
      imports: [DefaultHomeLayoutComponent],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para /login ao executar logout()', () => {
    spyOn(localStorage, 'removeItem');

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('name');
    expect(localStorage.removeItem).toHaveBeenCalledWith('role');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve ter o ano atual em currentYear', () => {
    const thisYear = new Date().getFullYear();
    expect(component.currentYear).toBe(thisYear);
  });
});
