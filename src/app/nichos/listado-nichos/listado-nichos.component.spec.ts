import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNichosComponent } from './listado-nichos.component';

describe('ListadoNichosComponent', () => {
  let component: ListadoNichosComponent;
  let fixture: ComponentFixture<ListadoNichosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoNichosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoNichosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
