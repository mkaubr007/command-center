import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedHomeService {
  dashboardWalkthrough = new BehaviorSubject(null);
}
