import { TestBed, inject } from '@angular/core/testing';

import { IceAndFireService } from './ice-and-fire.service';

describe('IceAndFireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IceAndFireService]
    });
  });

  it('should be created', inject([IceAndFireService], (service: IceAndFireService) => {
    expect(service).toBeTruthy();
  }));
});
