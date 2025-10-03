import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageBinRulesComponent } from './storage-bin-rules.component';

describe('StorageBinRulesComponent', () => {
  let component: StorageBinRulesComponent;
  let fixture: ComponentFixture<StorageBinRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageBinRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageBinRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
