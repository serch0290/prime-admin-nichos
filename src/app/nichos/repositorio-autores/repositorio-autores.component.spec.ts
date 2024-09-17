import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorioAutoresComponent } from './repositorio-autores.component';

describe('RepositorioAutoresComponent', () => {
  let component: RepositorioAutoresComponent;
  let fixture: ComponentFixture<RepositorioAutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositorioAutoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositorioAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
