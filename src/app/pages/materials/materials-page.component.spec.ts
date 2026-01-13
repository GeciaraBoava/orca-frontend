import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsPageComponent } from './materials-page.component';

describe('BudgetsComponent', () => {
  let component: MaterialsPageComponent;
  let fixture: ComponentFixture<MaterialsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
