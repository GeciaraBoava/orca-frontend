import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCardsLayoutComponent } from './default-cards-layout.component';

describe('DefaultCardsLayoutComponent', () => {
  let component: DefaultCardsLayoutComponent;
  let fixture: ComponentFixture<DefaultCardsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultCardsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultCardsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
