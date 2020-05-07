import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TotaltodayPage } from './totaltoday.page';

describe('TotaltodayPage', () => {
  let component: TotaltodayPage;
  let fixture: ComponentFixture<TotaltodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotaltodayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotaltodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
