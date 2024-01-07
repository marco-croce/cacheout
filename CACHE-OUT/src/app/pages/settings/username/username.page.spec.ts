import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsernamePage } from './username.page';

describe('UsernamePage', () => {
  let component: UsernamePage;
  let fixture: ComponentFixture<UsernamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
