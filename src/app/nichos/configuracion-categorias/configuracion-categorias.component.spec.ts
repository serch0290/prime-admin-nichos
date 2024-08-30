import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCategoriasComponent } from './configuracion-categorias.component';

describe('ConfiguracionCategoriasComponent', () => {
  let component: ConfiguracionCategoriasComponent;
  let fixture: ComponentFixture<ConfiguracionCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionCategoriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
