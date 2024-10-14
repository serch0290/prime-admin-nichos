import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPrivacidadComponent } from './configuracion-privacidad.component';

describe('ConfiguracionPrivacidadComponent', () => {
  let component: ConfiguracionPrivacidadComponent;
  let fixture: ComponentFixture<ConfiguracionPrivacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionPrivacidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionPrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
