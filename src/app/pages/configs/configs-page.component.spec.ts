import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigsPageComponent } from './configs-page.component';

describe('BudgetsComponent', () => {
  let component: ConfigsPageComponent;
  let fixture: ComponentFixture<ConfigsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
