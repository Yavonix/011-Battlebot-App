import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotPage } from './bot.page';

describe('BotPage', () => {
  let component: BotPage;
  let fixture: ComponentFixture<BotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
