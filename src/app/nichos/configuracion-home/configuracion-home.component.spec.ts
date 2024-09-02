import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionHomeComponent } from './configuracion-home.component';

describe('ConfiguracionHomeComponent', () => {
  let component: ConfiguracionHomeComponent;
  let fixture: ComponentFixture<ConfiguracionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
