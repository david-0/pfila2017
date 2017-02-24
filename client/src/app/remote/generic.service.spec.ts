/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GenericService } from './generic.service';
import {User} from "../user";

describe('GenericService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericService]
    });
  });

  it('should ...', inject([GenericService], (service: GenericService<User>) => {
    expect(service).toBeTruthy();
  }));
});
