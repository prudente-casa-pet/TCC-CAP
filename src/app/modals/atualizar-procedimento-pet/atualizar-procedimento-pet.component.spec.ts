import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AtualizarProcedimentoPetComponent } from './atualizar-procedimento-pet.component';

describe('AtualizarProcedimentoPetComponent', () => {
  let component: AtualizarProcedimentoPetComponent;
  let fixture: ComponentFixture<AtualizarProcedimentoPetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtualizarProcedimentoPetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AtualizarProcedimentoPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
