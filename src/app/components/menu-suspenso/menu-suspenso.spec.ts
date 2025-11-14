import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSuspenso } from './menu-suspenso';

describe('MenuSuspenso', () => {
  let component: MenuSuspenso;
  let fixture: ComponentFixture<MenuSuspenso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSuspenso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSuspenso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
