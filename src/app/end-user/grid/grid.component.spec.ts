/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { GridComponent } from './grid.component';

describe('Component: Grid', () => {
  it('should create an instance', () => {
    let component = new GridComponent();
    expect(component).toBeTruthy();
  });
});
