import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaiterSelectTablePage } from './waiter-select-table.page';

describe('WaiterSelectTablePage', () => {
  let component: WaiterSelectTablePage;
  let fixture: ComponentFixture<WaiterSelectTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterSelectTablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaiterSelectTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
