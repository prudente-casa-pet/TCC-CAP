import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedimentoPetPage } from './procedimento-pet.page';

describe('ProcedimentoPetPage', () => {
  let component: ProcedimentoPetPage;
  let fixture: ComponentFixture<ProcedimentoPetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProcedimentoPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
