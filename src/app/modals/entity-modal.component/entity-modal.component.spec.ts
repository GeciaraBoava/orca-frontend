import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityModalComponent } from './entity-modal.component';

describe('UserModalComponent', () => {
  let component: EntityModalComponent;
  let fixture: ComponentFixture<EntityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
