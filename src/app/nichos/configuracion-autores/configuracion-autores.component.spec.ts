import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAutoresComponent } from './configuracion-autores.component';

describe('ConfiguracionAutoresComponent', () => {
  let component: ConfiguracionAutoresComponent;
  let fixture: ComponentFixture<ConfiguracionAutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionAutoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
