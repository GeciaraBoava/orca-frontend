import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionsComponent } from './compositions.component';

describe('BudgetsComponent', () => {
  let component: CompositionsComponent;
  let fixture: ComponentFixture<CompositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
