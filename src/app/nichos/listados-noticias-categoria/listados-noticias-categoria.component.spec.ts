import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadosNoticiasCategoriaComponent } from './listados-noticias-categoria.component';

describe('ListadosNoticiasCategoriaComponent', () => {
  let component: ListadosNoticiasCategoriaComponent;
  let fixture: ComponentFixture<ListadosNoticiasCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadosNoticiasCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadosNoticiasCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
