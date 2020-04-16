import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaiterSelectFoodPage } from './waiter-select-food.page';

describe('WaiterSelectFoodPage', () => {
  let component: WaiterSelectFoodPage;
  let fixture: ComponentFixture<WaiterSelectFoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterSelectFoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaiterSelectFoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
