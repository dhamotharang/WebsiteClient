import { TestBed, inject } from '@angular/core/testing';

import { CategoryProductService } from './category-product.service';

describe('CategoryProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryProductService]
    });
  });

  it('should be created', inject([CategoryProductService], (service: CategoryProductService) => {
    expect(service).toBeTruthy();
  }));
});
