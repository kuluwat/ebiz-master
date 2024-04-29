import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// Angular Material Modules
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// ngx-bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

// Other Third-party Modules
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CurrencyMaskModule } from 'ng2-currency-mask';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './screen/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSpinnerOverlayComponent } from './components/mat-spinner-overlay/mat-spinner-overlay.component';
import { ErrorComponent } from './components/error/error.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/main/home/home.component';
import { ServicesComponent } from './components/main/services/services.component';
import { RequestListComponent } from './components/main/request-list/request-list.component';
import { RequestComponent } from './components/main/request/request.component';
import { RequestPartIComponent } from './components/main/request-part-i/request-part-i.component';
import { RequestPartIIComponent } from './components/main/request-part-ii/request-part-ii.component';
import { RequestPartIIIComponent } from './components/main/request-part-iii/request-part-iii.component';
import { RequestPartCapComponent } from './components/main/request-part-cap/request-part-cap.component';
import { MasterComponent } from './screen/master/master.component';
import { AirticketComponent } from './screen/master/airticket/airticket.component';
import { MenuComponent } from './components/menu/menu.component';
import { ButtonToTopComponent } from './components/button-to-top/button-to-top.component';
import { LoadingBgColorComponent } from './components/loading-bg-color/loading-bg-color.component';
import { TransportationComponent } from './screen/master/transportation/transportation.component';
import { TravelerhistoryComponent } from './screen/master/travelerhistory/travelerhistory.component';
import { TravelinsuranceComponent } from './screen/master/travelinsurance/travelinsurance.component';
import { TravelexpenseComponent } from './screen/master/travelexpense/travelexpense.component';
import { AccommodationComponent } from './screen/master/accommodation/accommodation.component';
import { VisaComponent } from './screen/master/visa/visa.component';
import { PassportComponent } from './screen/master/passport/passport.component';
import { AllowanceComponent } from './screen/master/allowance/allowance.component';
import { ReimbursementComponent } from './screen/master/reimbursement/reimbursement.component';
import { IsosComponent } from './screen/master/isos/isos.component';
import { FeedbackComponent } from './screen/master/feedback/feedback.component';
import { SafePipe } from './safe.pipe';
import { InsurancerecordComponent } from './screen/master/insurancerecord/insurancerecord.component';
import { LogindevComponent } from './screen/master/logidev/logindev.component';
import { TravelrecordComponent } from './screen/master/travelrecord/travelrecord.component';
import { IsosrecordComponent } from './screen/master/isosrecord/isosrecord.component';

import { LocalStorageService } from './services/localstorage/local-storage.service';
import { HttpmanagerService } from './services/http/httpmanager.service';
import { MasterService } from './http/master/master.service';
import { PartIService } from './http/part-i/part-i.service';
import { PartIiService } from './http/part-ii/part-ii.service';
import { PartIiiService } from './http/part-iii/part-iii.service';
import { PartIiiiService } from './http/part-iiii/part-iiii.service';
import { AuthenService } from './http/authen/authen.service';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MatSpinnerOverlayComponent,
    ErrorComponent,
    PagenotfoundComponent,
    MainComponent,
    HomeComponent,
    ServicesComponent,
    RequestListComponent,
    RequestComponent,
    RequestPartIComponent,
    // RequestPartIIComponent,
    RequestPartIIIComponent,
    RequestPartCapComponent,
    MasterComponent,
    AirticketComponent,
    MenuComponent,
    ButtonToTopComponent,
    LoadingBgColorComponent,
    TransportationComponent,
    TravelerhistoryComponent,
    TravelexpenseComponent,
    TravelinsuranceComponent,
    AccommodationComponent,
    VisaComponent,
    AllowanceComponent,
    PassportComponent,
    ReimbursementComponent,
    IsosComponent,
    FeedbackComponent,
    SafePipe,
    InsurancerecordComponent,
    LogindevComponent,
    TravelrecordComponent,
    IsosrecordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    // Angular Material Modules
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,

    // ngx-bootstrap
    BsDatepickerModule.forRoot(),
    ModalModule,

    // Other Third-party Modules
    NgxMatSelectSearchModule,
    AngularEditorModule,
    SelectDropDownModule,
    NgMultiSelectDropDownModule,
    AutocompleteLibModule,
    CurrencyMaskModule,
  ],
  providers: [

    LocalStorageService,
    HttpmanagerService,
    //SearchEmpService,
    MasterService,
    //SavePartIService,
    PartIService,
    PartIiService,
    PartIiiService,
    PartIiiiService,
    AuthenService,
    DatePipe,
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
