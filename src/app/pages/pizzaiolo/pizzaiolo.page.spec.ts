import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PizzaioloPage } from './pizzaiolo.page';

describe('PizzaioloPage', () => {
  let component: PizzaioloPage;
  let fixture: ComponentFixture<PizzaioloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PizzaioloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PizzaioloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
