import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheDetailsPage } from './cache-details.page';

describe('CacheDetailsPage', () => {
  let component: CacheDetailsPage;
  let fixture: ComponentFixture<CacheDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CacheDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
