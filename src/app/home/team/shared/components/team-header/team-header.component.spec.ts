import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamHeaderComponent } from './team-header.component';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../team.service';

class MockTeamService {}

describe('TeamHeaderComponent', () => {
  let component: TeamHeaderComponent;
  let fixture: ComponentFixture<TeamHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamHeaderComponent ],
      providers: [
        { provide: TeamService, useClass: MockTeamService }
      ],
      imports: [
        SharedHomeModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamHeaderComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
