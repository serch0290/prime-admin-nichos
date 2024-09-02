import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionRepositorioComponent } from './configuracion-repositorio.component';

describe('ConfiguracionRepositorioComponent', () => {
  let component: ConfiguracionRepositorioComponent;
  let fixture: ComponentFixture<ConfiguracionRepositorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionRepositorioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionRepositorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
