import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncModalNgxComponent } from './async-modal-ngx.component';

describe('AsyncModalNgxComponent', () => {
  let component: AsyncModalNgxComponent;
  let fixture: ComponentFixture<AsyncModalNgxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncModalNgxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsyncModalNgxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
