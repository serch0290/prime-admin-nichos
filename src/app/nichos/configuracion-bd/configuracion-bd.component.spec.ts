import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionBdComponent } from './configuracion-bd.component';

describe('ConfiguracionBdComponent', () => {
  let component: ConfiguracionBdComponent;
  let fixture: ComponentFixture<ConfiguracionBdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionBdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionBdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
