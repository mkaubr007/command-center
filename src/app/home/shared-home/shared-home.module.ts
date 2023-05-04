import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Material Imports & Modules*/
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

/*Components*/
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { ProfileWidgetComponent } from './components/profile-widget/profile-widget.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CustomTabComponent } from './components/custom-tab/custom-tab.component';
import { EmptyScreenComponent } from './components/empty-screen/empty-screen.component';
import { WalkthroughComponent } from './components/walkthrough/walkthrough.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { ButtonComponent } from './components/button/button.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DeleteComponent } from './components/delete/delete.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { FlagSvgComponent } from './components/flag-svg/flag-svg.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { HomeDropdownComponent } from './components/home-dropdown/home-dropdown.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { EmailFieldComponent } from './components/email-field/email-field.component';

/*Service*/
import { SharedHomeService } from './shared-home.service';

/*Perfect scrollbar*/
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AssigneeDropdownComponent } from './components/assignee-dropdown/assignee-dropdown.component';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox/tri-state-checkbox.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationInfiniteListComponent } from './components/notification-infinite-list/notification-infinite-list.component';
import { NotificationService } from './services/notification/notification.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import { ProcessHeaderDropdownComponent } from './components/process-header-dropdown/process-header-dropdown.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ConfirmPopupComponent,
    SnackBarComponent,
    ProfileWidgetComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    CustomTabComponent,
    EmptyScreenComponent,
    WalkthroughComponent,
    UploadImageComponent,
    SelectBoxComponent,
    AssigneeDropdownComponent,
    ButtonComponent,
    SearchFieldComponent,
    PaginatorComponent,
    InputFieldComponent,
    LoaderComponent,
    DeleteComponent,
    RadioButtonComponent,
    FlagSvgComponent,
    ToggleComponent,
    CheckboxComponent,
    EmailFieldComponent,
    HomeDropdownComponent,
    DatepickerComponent,
    TextareaComponent,
    EditImageComponent,
    TriStateCheckboxComponent,
    NotificationPanelComponent,
    NotificationInfiniteListComponent,
    NotificationDetailComponent,
    LogoutModalComponent,
    ProcessHeaderDropdownComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PerfectScrollbarModule,
    NgSelectModule,
    ImageCropperModule,
    InfiniteScrollModule,
    NgxDaterangepickerMd.forRoot(),
    TooltipModule,
  ],
  entryComponents: [
    ConfirmPopupComponent,
    SnackBarComponent,
    ChangePasswordComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    SharedHomeService,
    NotificationService,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ProfileWidgetComponent,
    EmptyScreenComponent,
    WalkthroughComponent,
    UploadImageComponent,
    SelectBoxComponent,
    ButtonComponent,
    CustomTabComponent,
    SearchFieldComponent,
    PaginatorComponent,
    AssigneeDropdownComponent,
    InputFieldComponent,
    SharedModule,
    LoaderComponent,
    DeleteComponent,
    RadioButtonComponent,
    FlagSvgComponent,
    ToggleComponent,
    CheckboxComponent,
    EmailFieldComponent,
    HomeDropdownComponent,
    DatepickerComponent,
    TextareaComponent,
    EditImageComponent,
    TriStateCheckboxComponent,
    NotificationPanelComponent,
    LogoutModalComponent,
    ProcessHeaderDropdownComponent
  ],
})
export class SharedHomeModule {}
