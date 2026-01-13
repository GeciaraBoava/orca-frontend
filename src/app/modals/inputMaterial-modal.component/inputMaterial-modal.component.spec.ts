import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMaterialModalComponent } from './inputMaterial-modal.component';

describe('UserModalComponent', () => {
  let component: InputMaterialModalComponent;
  let fixture: ComponentFixture<InputMaterialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputMaterialModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
