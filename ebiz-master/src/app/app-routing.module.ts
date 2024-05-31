import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './screen/login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { ErrorComponent } from './components/error/error.component';
import { RequestPartIComponent } from './main/request-part-i/request-part-i.component';
import { ServicesComponent } from './main/services/services.component';
import { RequestListComponent } from './main/request-list/request-list.component';
import { RequestPartIIComponent } from './main/request-part-ii/request-part-ii.component';
import { RequestPartIIIComponent } from './main/request-part-iii/request-part-iii.component';
import { RequestComponent } from './main/request/request.component';
import { RequestPartCapComponent } from './main/request-part-cap/request-part-cap.component';
import { MasterComponent } from './screen/master/master.component';
import { TravelerhistoryComponent } from './screen/master/travelerhistory/travelerhistory.component';
import { AccommodationComponent } from './screen/master/accommodation/accommodation.component';
import { VisaComponent } from './screen/master/visa/visa.component';
import { PassportComponent } from './screen/master/passport/passport.component';
import { AllowanceComponent } from './screen/master/allowance/allowance.component';
import { ReimbursementComponent } from './screen/master/reimbursement/reimbursement.component';
import { TravelinsuranceComponent } from './screen/master/travelinsurance/travelinsurance.component';
import { IsosComponent } from './screen/master/isos/isos.component';
import { TransportationComponent } from './screen/master/transportation/transportation.component';
import { TravelexpenseComponent } from './screen/master/travelexpense/travelexpense.component';
import { FeedbackComponent } from './screen/master/feedback/feedback.component';
import { LogindevComponent } from './screen/logidev/logindev.component';
import { MtbookingstatusComponent } from './screen/mtbookingstatus/mtbookingstatus.component';
import { MtdailyallowanceComponent } from './screen/mtdailyallowance/mtdailyallowance.component';
import { MtalreadybookedComponent } from './screen/mtalreadybooked/mtalreadybooked.component';
import { MaintainComponent } from './maintain/maintain.component';
// import { EbizhomeComponent } from './master/ebizhome/ebizhome.component';
import { MtvisadocumentComponent } from './screen/mtvisadocument/mtvisadocument.component';
import { MtvisacountriesComponent } from './screen/mtvisacountries/mtvisacountries.component';
import { MatSpinnerOverlayComponent } from './components/mat-spinner-overlay/mat-spinner-overlay.component';
import { LoadingBgColorComponent } from './components/loading-bg-color/loading-bg-color.component';
import { TravelrecordComponent } from './screen/master/travelrecord/travelrecord.component';
import { IsosrecordComponent } from './screen/master/isosrecord/isosrecord.component';
import { InsurancerecordComponent } from './screen/master/insurancerecord/insurancerecord.component';
import { MtkhcodeComponent } from './screen/mtkhcode/mtkhcode.component';
import { EbizhomeComponent } from './screen/home/ebizhome.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MtfeedbackquestionComponent } from './screen/mtfeedbackquestion/mtfeedbackquestion.component';
import { MtbrokerComponent } from './screen/mtbroker/mtbroker.component';
import { ManageadminComponent } from './manageadmin/manageadmin.component';
import { AirticketComponent } from './screen/master/airticket/airticket.component';


const routes: Routes = [
  // { path: "", redirectTo: "/main/services", pathMatch: "full" },
  { path: "", redirectTo: "/ebizhome", pathMatch: "full" },
  { path: "errors", component: ErrorComponent, pathMatch: "full" },
  { path: "login/:token/:user", component: LoginComponent, pathMatch: "full" },
  // { path: "i", component: RequestPartIComponent, pathMatch: "full" },
  // { path: "ii", component: RequestPartIIComponent, pathMatch: "full" },


  {
    path: "main", component: MainComponent, children: [
      { path: "", redirectTo: "/main/services", pathMatch: "full" },
      { path: "home", component: HomeComponent, pathMatch: "full" },
      { path: "services", component: ServicesComponent, pathMatch: "full" },
      { path: "request_list/:types", component: RequestListComponent, pathMatch: "full" },
      {
        path: "request/:types/:ids", component: RequestComponent,
        children: [
          { path: "", redirectTo: "/errors", pathMatch: "full" },
          { path: "i", component: RequestPartIComponent, pathMatch: "full" },
          { path: "ii", component: RequestPartIIComponent, pathMatch: "full" },
          { path: "iii", component: RequestPartIIIComponent, pathMatch: "full" },
          { path: "cap", component: RequestPartCapComponent, pathMatch: "full" },
          { path: "**", redirectTo: "/errors", pathMatch: "full" }
        ]
      },
      { path: "**", redirectTo: "/errors", pathMatch: "full" }
    ], canActivate: [CanActivateViaAuthGuard]
  },
  // pase ii
  { path: "ebizhome", component: EbizhomeComponent, pathMatch: "full" },
  { path: "manageadmin", component: ManageadminComponent, pathMatch: "full" },
  { path: "matoverlay", component: MatSpinnerOverlayComponent, pathMatch: "full" },
  { path: "bgcolor", component: LoadingBgColorComponent, pathMatch: "full" },
  // { path: "personal", component: PersonalComponent, pathMatch: "full" },
  // { path: "docx", component: AppComponent, pathMatch: "full" },
  {
    path: "master/:id", component: MasterComponent,
    children: [
      // { path: "", redirectTo:"/master/master", pathMatch: "full" },
      { path: "travelerhistory", component: TravelerhistoryComponent, pathMatch: "full" },
      { path: "airticket", component: AirticketComponent, pathMatch: "full" },
      { path: "accommodation", component: AccommodationComponent, pathMatch: "full" },
      { path: "visa", component: VisaComponent, pathMatch: "full" },
      { path: "passport", component: PassportComponent, pathMatch: "full" },
      { path: "allowance", component: AllowanceComponent, pathMatch: "full" },
      { path: "reimbursement", component: ReimbursementComponent, pathMatch: "full" },
      { path: "travelinsurance", component: TravelinsuranceComponent, pathMatch: "full" },
      { path: "isos", component: IsosComponent, pathMatch: "full" },
      { path: "transportation", component: TransportationComponent, pathMatch: "full" },
      { path: "travelexpense", component: TravelexpenseComponent, pathMatch: "full" },
      { path: "feedback", component: FeedbackComponent, pathMatch: "full" },
      { path: "travelrecord", component: TravelrecordComponent, pathMatch: "full" },
      { path: "isosrecord", component: IsosrecordComponent, pathMatch: "full" },
      { path: "insurancerecord", component: InsurancerecordComponent, pathMatch: "full" },
      
    ]
  },

  {
    path: "maintain", component: MaintainComponent,
    children: [
      { path: "", redirectTo: "/maintain/mtbookingstatus", pathMatch: "full" },
      { path: "mtbookingstatus", component: MtbookingstatusComponent, pathMatch: "full" },
      { path: "mtdailyallowance", component: MtdailyallowanceComponent, pathMatch: "full" },
      { path: "mtalreadybooked", component: MtalreadybookedComponent, pathMatch: "full" },
      { path: "mtfeedbackquestion", component: MtfeedbackquestionComponent, pathMatch: "full" },
      { path: "mtvisadocument", component: MtvisadocumentComponent, pathMatch: "full" },
      { path: "mtvisacountries", component: MtvisacountriesComponent, pathMatch: "full" },
      { path: "mtbroker", component: MtbrokerComponent, pathMatch: "full" },
      { path: "mtkhcode", component: MtkhcodeComponent, pathMatch: "full" },
    ]
  },
  
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "logindev", component: LogindevComponent, pathMatch: "full" },
  { path: "**", redirectTo: "/errors", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }