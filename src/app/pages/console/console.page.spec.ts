import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsolePage } from './console.page';

describe('ConsolePage', () => {
  let component: ConsolePage;
  let fixture: ComponentFixture<ConsolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
