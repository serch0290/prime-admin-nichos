import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaGeneralComponent } from './panorama-general.component';

describe('PanoramaGeneralComponent', () => {
  let component: PanoramaGeneralComponent;
  let fixture: ComponentFixture<PanoramaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanoramaGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanoramaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
