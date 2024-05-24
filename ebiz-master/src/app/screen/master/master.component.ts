import { Route } from '@angular/router';
import { Component, forwardRef, Inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
//import { NgxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { AppRoutingModule } from '../../app-routing.module';
import { AuthenService } from '../../http/authen/authen.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import { forceToPageLoginWeb, gotoPage } from '../../function/globalfunction.component';



@Component({
  selector: 'app-master',
  templateUrl: './master.html',
  styleUrls: ['./master.css']
})
export class MasterComponent implements OnInit {

  profile = {
    username: "Mr.Attaphon ADB-Thailand",
    images: "assets/filedata/profile/zattaphonso/avatar-m-1.png",
    user_admin: false
  }

  profileLogin = {
    username: "",
    images: "",
    user_admin: null,
    emp_id: "",
    user_type: ""
  }

  isLoading = false;
  message = {
    sts: false,
    text: "เข้าสู่ระบบสำเร็จ"
  }

  confirmBox = {
    sts: false,
    text: "XXXX",
    success: null
  }
  confirmTextBox = {
    sts: false,
    text: "XXXX",
    input: "",
    success: null
  }

  success : any;

  DOC_ID: string = "";
  TYPES: string = "";

  QueryParamX = "";
  TRAVEL_TYPE: string = "";

  menuList = [{
    token_login: "",
    pagename: "travelerhistory",
    menuname: "Traveler Information",
    url: "/master/travelerhistory",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "travelerhistory",
    menuname: "Personal Detail",
    url: "/master/travelerhistory",
    oversea: false,
    local: false,
    personal: true,
    display: true
  },
  {
    token_login: "",
    pagename: "airticket",
    menuname: "Air Ticket",
    url: "/master/airticket",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "accommodation",
    menuname: "Accommodation",
    url: "/master/accommodation",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "visa",
    menuname: "VISA",
    url: "/master/visa",
    oversea: true,
    local: false,
    personal: true,
    display: true
  },
  {
    token_login: "",
    pagename: "passport",
    menuname: "Passport",
    url: "/master/passport",
    oversea: true,
    local: false,
    personal: true,
    display: true
  },
  {
    token_login: "",
    pagename: "allowance",
    menuname: "Allowance",
    url: "/master/allowance",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "reimbursement",
    menuname: "Reimbursement",
    url: "/master/reimbursement",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "travelinsurance",
    menuname: "Travel Insurance",
    url: "/master/travelinsurance",
    oversea: true,
    local: false,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "isos",
    menuname: "ISOS",
    url: "/master/isos",
    oversea: true,
    local: false,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "transportation",
    menuname: "Transportation",
    url: "/master/transportation",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "travelexpense",
    menuname: "Travel Expense",
    url: "/master/travelexpense",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "feedback",
    menuname: "Feedback",
    url: "/master/feedback",
    oversea: true,
    local: true,
    personal: false,
    display: true
  },
  {
    token_login: "",
    pagename: "travelrecord",
    menuname: "Travel Record",
    url: "/master/travelrecord",
    oversea: false,
    local: false,
    personal: true,
    display: true
  },
  {
    token_login: "",
    pagename: "isosrecord",
    menuname: "ISOS Record",
    url: "/master/isosrecord",
    oversea: false,
    local: false,
    personal: true,
    display: true
  },
  {
    token_login: "",
    pagename: "insurancerecord",
    menuname: "Insurance Record",
    url: "/master/insurancerecord",
    oversea: false,
    local: false,
    personal: true,
    display: true
  }]

  menuListMaintain = [{

    token_login: "",
    pagename: "mtbookingstatus",
    menuname: "Booking Status",
    url: "/maintain/mtbookingstatus",
    display: true,
    sort: 1
  },
  {
    token_login: "",
    pagename: "mtdailyallowance",
    menuname: "Daily Allowance",
    url: "/maintain/mtdailyallowance",
    display: true,
    sort: 2
  },
  {
    token_login: "",
    pagename: "mtalreadybooked",
    menuname: "Already Booked",
    url: "/maintain/mtalreadybooked",
    display: true,
    sort: 3
  },
  {
    token_login: "",
    pagename: "mtfeedbackquestion",
    menuname: "Feedback Question",
    url: "/maintain/mtfeedbackquestion",
    display: true,
    sort: 3
  },
  ]

  arrayOfValues: any;
  isParams: boolean = false;

  userSelected: string = "";

  constructor(
    private route: ActivatedRoute,
    private authenHttp: AuthenService,
    private router: Router,
    private zone: NgZone,
    //private _NgxZendeskWebwidgetService: NgxZendeskWebwidgetService,
    public ws: AspxserviceService
  ) {
    //this.didCheckTokenDied()


    const myArray = this.router.getCurrentNavigation()?.extras.state;
    if (myArray === null || myArray === undefined) {
      this.arrayOfValues = new Array<string>();
    } else {
      this.isParams = true;
      console.log('----- Param value-----');
      console.log(myArray['paramsDesc']);

      this.arrayOfValues = myArray['paramsDesc'].queryParams;
      console.log(this.arrayOfValues);

      this.menuList.forEach(element => {

        this.arrayOfValues.requestType === 'oversea' || this.arrayOfValues.requestType === 'overseatraining' ? element.display = element.oversea : this.arrayOfValues.requestType === 'local' || this.arrayOfValues.requestType === 'localtraining' ? element.display = element.local : this.arrayOfValues.requestType === 'personal' ? element.display = element.personal : element.display = false;

      });



    }
  }

  ngOnInit() {

    this.getParameter();

  }

  onActivate() {
    window.scroll(0, 0);
  }

  getParameter() {
    this.route.params.subscribe(params => {

      this.DOC_ID = params["id"]
      this.route.snapshot.paramMap.get('t') === 'detail' ? this.TYPES = 'detail' : this.TYPES = 'view';
      console.log('---Action types---');
      console.log(this.TYPES);
      console.log(this.DOC_ID);

      if (this.DOC_ID != "") {
        console.log('router events')
        let routerX = this.router.url.split("/");
        console.log(routerX);

        if (routerX.length === 3) {
          let pagename = this.checkParams();
          this.zone.run(() => this.router.navigate(['/master', this.DOC_ID, pagename]));
          this.QueryParamX = "/master/" + this.DOC_ID + "/" + pagename + "/";
        }
        else if (routerX.length === 4) {
          this.zone.run(() => this.router.navigate(['/master', this.DOC_ID, routerX[3].toLowerCase()]));
          this.QueryParamX = "/master/" + this.DOC_ID + "/" + routerX[3].toLowerCase() + "/";
        }


        if (this.isParams === false) {


          let requestType = this.DOC_ID === 'personal' ? this.DOC_ID : this.DOC_ID.substring(0, 2);
          console.log(requestType);

          this.menuList.forEach(element => {
            requestType === 'OB' || requestType === 'OT' ? element.display = element.oversea : requestType === 'LB' || requestType === 'LT' ? element.display = element.local : requestType === 'personal' ? element.display = element.personal : element.display = false;
          });

          this.TRAVEL_TYPE = requestType === 'OB' || requestType === 'OT' ? 'oversea' : requestType === 'LB' || requestType === 'LT' ? 'local' : '';

          if (this.DOC_ID === 'personal') {
            this.didFetchProfile();
          }
        }
        else {
          this.TRAVEL_TYPE = this.arrayOfValues.requestType;
        }
      }

    })
  }

  checkParams() {
    let pagename = "travelerhistory";
    if (this.DOC_ID === 'travelerhistory') {
      pagename = "travelerhistory";
    }
    else if (this.DOC_ID === 'airticket') {
      pagename = "airticket";
    }
    else if (this.DOC_ID === 'accommodation') {
      pagename = "accommodation";
    }
    else if (this.DOC_ID === 'visa') {
      pagename = "visa";
    }
    else if (this.DOC_ID === 'passport') {
      pagename = "passport";
    }
    else if (this.DOC_ID === 'allowance') {
      pagename = "allowance";
    }
    else if (this.DOC_ID === 'reimbursement') {
      pagename = "reimbursement";
    }
    else if (this.DOC_ID === 'travelinsurance') {
      pagename = "travelinsurance";
    }
    else if (this.DOC_ID === 'isos') {
      pagename = "isos";
    }
    else if (this.DOC_ID === 'transportation') {
      pagename = "transportation";
    }
    else if (this.DOC_ID === 'travelexpense') {
      pagename = "travelexpense";
    }
    else if (this.DOC_ID === 'feedback') {
      pagename = "feedback";
    }
    return pagename;
  }

  getPageUrl(page: string): string {
    return gotoPage(this.DOC_ID, page);
  }

  didCheckTokenDied() {
    const onSuccess = (dao : any) => {
      console.log(dao)
      if (dao["msg_sts"] == "S") {
        // authen
        console.log("authen")
        this.didFetchProfile();
      } else {
        // TODO ::
        this.forceToPageLogin()
        // redirect to login pages
        // set localStorage to guest
      }
    }
    this.ws.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))
    // this.authenHttp.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))

  }

  // didFetchProfile(): void {
  //   console.log(">>> CHECK USER TYPE <<<");
  //   this.ws.onFetchUserProfile().subscribe(
  //     (dao: any) => this.onSuccess(dao),
  //     (error: any) => alert("loginProfile Error: " + error)
  //   );
  // }

  private onSuccess(dao: any): void {
    console.log(dao);
    console.log("--- CHECK USER TYPE success ---");

    const userProfile: any = dao[0];

    this.profileLogin.username = userProfile.empName;
    this.profileLogin.images = userProfile.imgUrl;
    this.profileLogin.user_admin = userProfile.user_admin;
    this.profileLogin.emp_id = userProfile.empId;
    this.profileLogin.user_type = userProfile.user_type;

    this.updateMenuList(userProfile.user_admin);
  }

  private updateMenuList(isAdmin: boolean): void {
    if (!isAdmin) {
      this.menuList.forEach(element => {
        if (element.pagename === 'isosrecord' || element.pagename === 'insurancerecord') {
          element.display = false;
        }
      });
    }
  }

  didFetchProfile() {
    console.log("didFetchProfile")
    const onSuccess = (dao : any) => {
      console.log("xxx")
      if (dao.length == 0) {
        // redirect
        this.forceToPageLogin()
      }
      this.profile.username = dao[0]["empName"]
      this.profile.images = dao[0]["imgUrl"]
      this.profile.user_admin = dao[0]["user_admin"]
      //this.profile.username = "xxxxx"
      //this.profile.images = "http://srieng02/pic/TOP/579.jpg"
      //console.log(dao)
    }
    this.ws.onFetchUserProfile().subscribe(dao => onSuccess(dao))
  }

  forceToPageLogin() {

    // window.location.href = "http://10.224.43.14/WEBEbiz2/logintest.aspx";

    if (this.QueryParamX != "") {
      //ไม่ผ่าน authen ให้ redirect ไปที่หน้า login โดยใส่ page ที่ต้องเปิดหลังจากที่ login สำเร็จ
      this.router.navigate(['/logindev'], { queryParams: { page: this.QueryParamX } });
    }
    else {
      this.router.navigate(['/logindev']);
    }

    //this.router.navigate([url]);
  }
  forceToPageLoginWeb() {
    //window.location.href = "http://ebiz.frankenly.com/login/login/login";
    this.router.navigate(['/logindev']);
  }

  showMessage(txt : string) {
    console.log("SSSS")
    this.message.sts = true
    this.message.text = txt
  }

  hideMessage() {
    console.log("XXX")
    this.message.sts = false
  }

  showConfirm(txt : string, success : any) {
    this.confirmBox.success = success
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  showConfirmIn(txt : string) {
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  hideConfirm(isSuccess: Boolean) {
    this.confirmBox.sts = false
    if (isSuccess) {
    }
  }
  

  showConfirmTextbox(txt : string, success : any) {
    this.confirmTextBox.success = success
    this.confirmTextBox.text = txt
    this.confirmTextBox.sts = true
  }

  hideConfirmTextbox(isSuccess: Boolean) {
    this.confirmTextBox.sts = false
    if (isSuccess) {
      // this.confirmBox.success(this.confirmTextBox.input);
    }
    this.confirmTextBox.input = ""
  }

  handleLogout() {
    const lg = () => {
      this.authenHttp.logout().subscribe(value => {
        console.log(value)
      })

      localStorage["token"] = ""
      localStorage["user"] = ""
      forceToPageLoginWeb(this.router)
    }
    this.showConfirm("Do you want to logout?", lg)

  }

  activeProject(m : number) {
    if (m == 1) {

    }
  }


}