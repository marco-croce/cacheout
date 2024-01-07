import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileGeocacherPage } from './profile-geocacher.page';

describe('ProfileGeocacherPage', () => {
  let component: ProfileGeocacherPage;
  let fixture: ComponentFixture<ProfileGeocacherPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileGeocacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
