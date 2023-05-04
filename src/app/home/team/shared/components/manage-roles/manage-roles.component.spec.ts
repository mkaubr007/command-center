import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import { TeamService } from '../../../team.service';
import { TeamHeaderComponent } from '../team-header/team-header.component';
import { ManageRolesComponent } from './manage-roles.component';

class MockTeamService {}

describe('ManageRolesComponent', () => {
  let component: ManageRolesComponent;
  let fixture: ComponentFixture<ManageRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRolesComponent,
        TeamHeaderComponent
      ],
      providers: [
        { provide: TeamService, useClass: MockTeamService }
      ],
      imports: [SharedHomeModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolesComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
