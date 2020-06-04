import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VexGamePage } from './vex-game.page';

describe('VexGamePage', () => {
  let component: VexGamePage;
  let fixture: ComponentFixture<VexGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VexGamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VexGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
