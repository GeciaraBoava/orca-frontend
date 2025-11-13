import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultHomeLayoutComponent } from './default-home-layout.component';

describe('DefaultHomeLayoutComponent', () => {
  let component: DefaultHomeLayoutComponent;
  let fixture: ComponentFixture<DefaultHomeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultHomeLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
