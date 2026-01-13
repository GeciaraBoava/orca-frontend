import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigsModalComponent } from './configs-modal.component';

describe('UserModalComponent', () => {
  let component: ConfigsModalComponent;
  let fixture: ComponentFixture<ConfigsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
