import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheUserPage } from './cache-user.page';

describe('CacheUserPage', () => {
  let component: CacheUserPage;
  let fixture: ComponentFixture<CacheUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CacheUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
