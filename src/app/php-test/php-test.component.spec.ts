import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhpTestComponent } from './php-test.component';

describe('PhpTestComponent', () => {
  let component: PhpTestComponent;
  let fixture: ComponentFixture<PhpTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhpTestComponent]
    });
    fixture = TestBed.createComponent(PhpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
