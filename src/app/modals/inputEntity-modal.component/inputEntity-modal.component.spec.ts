import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEntityModalComponent } from './inputEntity-modal.component';

describe('UserModalComponent', () => {
  let component: InputEntityModalComponent;
  let fixture: ComponentFixture<InputEntityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEntityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputEntityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
