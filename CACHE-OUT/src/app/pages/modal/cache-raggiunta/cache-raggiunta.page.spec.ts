import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheRaggiuntaPage } from './cache-raggiunta.page';

describe('CacheRaggiuntaPage', () => {
  let component: CacheRaggiuntaPage;
  let fixture: ComponentFixture<CacheRaggiuntaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CacheRaggiuntaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
