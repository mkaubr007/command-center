
import { of, Subject } from 'rxjs';
import { ManageClient } from '../../../../../home/team/shared/components/manage-clients/test.constants';
export class MockErrorService {
    public onSearchByErrorChange = () => { return };
    public setDateRange = () => { return };
    public getErrorsByFilter = new Subject<boolean>();
    public filterSelection = {};
    public filterListData = {};
    public getCurrentSearch = () => of({});
    public getTotalErrorCount = () => of(1,"");
    public getUnresolvedErrorAndCsrCountForUser = () => of(ManageClient.UNRESOLVED_ERROR_AND_CSR_COUNT);
  }
