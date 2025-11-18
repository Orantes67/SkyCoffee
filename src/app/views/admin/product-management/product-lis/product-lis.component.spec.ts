import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLisComponent } from './product-lis.component';

describe('ProductLisComponent', () => {
  let component: ProductLisComponent;
  let fixture: ComponentFixture<ProductLisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
