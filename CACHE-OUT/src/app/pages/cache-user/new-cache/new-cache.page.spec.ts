import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCachePage } from './new-cache.page';

describe('NewCachePage', () => {
  let component: NewCachePage;
  let fixture: ComponentFixture<NewCachePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewCachePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
