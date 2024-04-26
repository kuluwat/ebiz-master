import {Location} from '@angular/common';

import {Component, NgZone, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit, NgModule} from '@angular/core';
import {FormBuilder, FormsModule, NgModel} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
// import { NgxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { AuthenService } from '../../http/authen/authen.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
})
export class HeaderComponent implements OnInit, AfterViewInit {


  profile = {
    // username: "Mr.Attaphon ADB-Thailand",
    // images: "assets/filedata/profile/zattaphonso/avatar-m-1.png",
    username: "",
    images: "assets/imgs/user_login.png",
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
  errorBox = {
    sts: false,
    text: "Error : "
  }

  success;

  DOC_ID: string = "";
  TYPES: string = "";

  QueryParamX = "";

  menuList = [ {
    token_login: "",
    pagename: "travelerhistory",
    menuname: "Traveler History",
    url: "/master/travelerhistory",
    oversea: true,
    local: true,
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
    menuname: "Feed back",
    url: "/master/feedback",
    oversea: true,
    local: true,
    personal: false,
    display: true
  } ]

  menuListMaintain = [ {

    token_login: "",
    pagename: "mtbookingstatus",
    menuname: "Booking Status",
    url: "/maintain/mtbookingstatus",
    display: true,
    sort: 1
  },
  {
    token_login: "",
    pagename: "mtalreadybooked",
    menuname: "Booking Provider",
    url: "/maintain/mtalreadybooked",
    display: true,
    sort: 2
  },
  {
    token_login: "",
    pagename: "mtdailyallowance",
    menuname: "Allowance Rate",
    url: "/maintain/mtdailyallowance",
    display: true,
    sort: 3
  },
  {
    token_login: "",
    pagename: "mtkhcode",
    menuname: "Employee Business Rate",
    url: "/maintain/mtkhcode",
    display: true,
    sort: 4
  },
  {
    token_login: "",
    pagename: "mtvisacountries",
    menuname: "VISA Countries",
    url: "/maintain/mtvisacountries",
    display: true,
    sort: 5
  },
  {
    token_login: "",
    pagename: "mtvisadocument",
    menuname: "VISA Document",
    url: "/maintain/mtvisadocument",
    display: true,
    sort: 6
  },
  {
    token_login: "",
    pagename: "mtbroker",
    menuname: "Insurance/ISOS List",
    url: "/maintain/mtbroker",
    display: true,
    sort: 7
  },
  {
    token_login: "",
    pagename: "mtfeedbackquestion",
    menuname: "Feedback",
    url: "/maintain/mtfeedbackquestion",
    display: true,
    sort: 8
  },

  ]

  // MenuActive = "txt-menu-selected";
  MenuActive = {
    HOME: false,
    MYTRIP: false,
    SERVICE: false,
    CONTACTUS: false
  }

  dataContact = {
    contactus: [
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ",
        name_en: "Piraporn Wiwatjaroenkit",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com",
        img: ""
      },
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ2",
        name_en: "Piraporn Wiwatjaroenkit2",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com2",
        img: ""
      },
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ2",
        name_en: "Piraporn Wiwatjaroenkit2",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com2",
        img: ""
      }
    ]
  }

  listContact: any = [];
  isAdmin: boolean = null;

  @ViewChild('template', {static: true}) template: TemplateRef<any>;
  @ViewChild('btnContact', {static: true}) btnContact: ElementRef;

  editTypes: string = "";
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;

  arrayOfValues: any;
  isParams: boolean = false;
  isCreate: boolean = false;
  //@ViewChild('myDiv') myDiv: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authenHttp: AuthenService,
    private router: Router,
    private zone: NgZone,
    //private _NgxZendeskWebwidgetService: NgxZendeskWebwidgetService,
    private fb: FormBuilder,
    public ws: AspxserviceService,
    private locat: Location,
    private modalService: BsModalService,
  ) {



    console.log('--- Header On Load---');
    console.log(this.locat.path());
    let path = this.locat.path().split('/');

    this.menuSelected(path[ 1 ].toLowerCase());

    //alert(path[path.length - 1]);
    // //console.log(path);
    // if (path[path.length - 1] === 'travelrecord') {
    //   this.MenuActive.HOME = false;
    //   this.MenuActive.MYTRIP = true;
    //   this.MenuActive.SERVICE = false;
    //   this.MenuActive.CONTACTUS = false;

    // }
    // else {
    //   this.menuSelected(path[1].toLowerCase());
    // }

    //this.menuSelected(path[1].toLowerCase());

    if (path[ 1 ].toLowerCase() === 'main') {
      this.isCreate = true;
    }
    else if (path[ 1 ].toLowerCase() === "ebizhome") {
      this.isCreate = true;
    }
    else {

      if (path[ 1 ].toLowerCase() === "master") {
        this.isCreate = false;

        if (path[ 1 ].toLowerCase() != 'ebizhome') {

          const myArray = this.router.getCurrentNavigation().extras.state;
          if (myArray === null || myArray === undefined) {
            this.arrayOfValues = new Array<string>();
          } else {
            this.isParams = true;
            console.log('----- Hearder Param value-----');
            // console.log(myArray.paramsDesc);

            // this.arrayOfValues = myArray.paramsDesc.queryParams;
            console.log(this.arrayOfValues);

            this.menuList.forEach(element => {

              this.arrayOfValues.requestType === 'oversea' || this.arrayOfValues.requestType === 'overseatraining' ? element.display = element.oversea : this.arrayOfValues.requestType === 'local' || this.arrayOfValues.requestType === 'localtraining' ? element.display = element.local : this.arrayOfValues.requestType === 'personal' ? element.display = element.personal : element.display = false;

            });

          }
        }
      }
      else {
        this.isCreate = true;
      }
    }
    this.didCheckTokenDied();
    this.getContectAdmin();
  }

  ngOnInit() {

    this.getParameter();

    // this.listContact = this.dataContact.contactus;
  }

  ngAfterViewInit() {
    //console.log(this.btnContact);
    //this.btnContact.nativeElement.click();
  }

  getContectAdmin() {

    let bodyX = {
      "token_login": localStorage[ "token" ],
      "filter_value": "contact_admin"
    }

    //console.log(bodyX)

    const onSuccess = (data) => {

      // console.log('---LoadEmpRoletList---');
      // console.log(data);

      this.dataContact.contactus = data.emprole_list;

      this.listContact = this.dataContact.contactus;

      //console.log(this.dataContact);
    }

    this.ws.callWs(bodyX, 'LoadEmpRoletList').subscribe(data => onSuccess(data), error => {

      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)

  }

  menuSelected(path) {
    if (path === 'ebizhome') {
      this.MenuActive.HOME = true;
      this.MenuActive.MYTRIP = false;
      this.MenuActive.SERVICE = false;
      this.MenuActive.CONTACTUS = false;
    }
    else if (path === 'master' || path === 'main' || path === 'maintain' || path === 'manageadmin') {
      this.MenuActive.HOME = false;
      this.MenuActive.MYTRIP = false;
      this.MenuActive.SERVICE = true;
      this.MenuActive.CONTACTUS = false;
    }


  }

  getParameter() {
    this.route.params.subscribe(params => {

      this.DOC_ID = params[ "id" ];
      //alert(this.DOC_ID)
      this.route.snapshot.paramMap.get('t') === 'detail' ? this.TYPES = 'detail' : this.TYPES = 'view';
      console.log('---Action types---');
      console.log(this.TYPES);


      if (this.DOC_ID != "" && this.DOC_ID != undefined) {
        console.log('router events')
        let routerX = this.router.url.split("/");
        console.log(routerX);

        if (routerX.length === 3) {
          let pagename = this.checkParams();
          this.zone.run(() => this.router.navigate([ '/master', this.DOC_ID, pagename ]));
          this.QueryParamX = "/master/" + this.DOC_ID + "/" + pagename + "/";
        }
        else if (routerX.length === 4) {
          this.zone.run(() => this.router.navigate([ '/master', this.DOC_ID, routerX[ 3 ].toLowerCase() ]));
          this.QueryParamX = "/master/" + this.DOC_ID + "/" + routerX[ 3 ].toLowerCase() + "/";
        }

        if (this.isParams === false) {
          let requestType = this.DOC_ID === 'personal' ? this.DOC_ID : this.DOC_ID.substring(0, 2);
          console.log(requestType);
          this.menuList.forEach(element => {
            requestType === 'OB' ? element.display = element.oversea : requestType === 'LB' ? element.display = element.local : requestType === 'personal' ? element.display = element.personal : element.display = false;
          });


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

  gotoPage(page) {
    //alert(this.DOC_ID)
    if (this.DOC_ID != undefined) {
      if (this.DOC_ID != "") {
        //alert(this.DOC_ID)
        //this.router.navigate(["/master", this.DOC_ID, page.toLowerCase()])

        return "/master/" + this.DOC_ID + "/" + page.toLowerCase();

      }
      else {

        return "/master/" + page.toLowerCase() + "/" + page.toLowerCase();
      }
    }


  }
  gotoPageMaintain(page) {

    return "/maintain/" + page.toLowerCase();
  }

  routerReload(page) {
    this.router.navigate([ '/master/personal/' + page ])
      .then(() => {
        window.location.reload();
      });
  }
  herderrouterReload(page) {
    this.router.navigate([ `${page}` ])
      .then(() => {
        window.location.reload();
      });
  }

  didCheckTokenDied() {
    const onSuccess = (dao) => {
      console.log(dao)
      if (dao[ "msg_sts" ] == "S") {
        // authen
        console.log("authen")
        this.didFetchProfile();
      } else {
        console.log('**************ERROR API(login)**************');
        console.log(dao);
        // TODO ::
        this.forceToPageLogin()
        // redirect to login pages
        // set localStorage to guest
      }
      //this.loadingSucess = true;
    }
    this.ws.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."));
    // this.authenHttp.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))

  }

  didFetchProfile() {
    console.log("didFetchProfile")
    const onSuccess = (dao) => {
      console.log(dao);
      console.log("---Load Profile Header success---")
      if (dao.length === 0) {

        this.forceToPageLogin();
      }
      else {

        const profile = _ => {

          this.profile.username = dao[ 0 ][ "empName" ];
          this.profile.images = dao[ 0 ][ "imgUrl" ];
          this.profile.user_admin = dao[ 0 ][ "user_admin" ];
          this.profile.emp_id = dao[ 0 ][ "empId" ];
          this.profile.user_type = dao[ 0 ][ "user_type" ];
          // this.isAdmin = dao[0]["user_admin"];
          const admin = dao[ 0 ][ "user_admin" ];
          this.isAdmin = admin;
          console.log(dao[ 0 ]);
          console.log(this.profile);

        }

        const profileData = profile('');


      }
    }
    this.ws.onFetchUserProfile().subscribe(dao => onSuccess(dao), error => alert("loginProfile Error : " + error));
  }

  forceToPageLogin() {

    // window.location.href = "http://10.224.43.14/WEBEbiz2/logintest.aspx";

    // const navigationExtras: NavigationExtras = {

    //   queryParams: {

    //     Status: "System timeout.",
    //   },
    //   skipLocationChange: false,
    //   fragment: 'top'
    // };

    if (this.QueryParamX != "") {
      //ไม่ผ่าน authen ให้ redirect ไปที่หน้า login โดยใส่ page ที่ต้องเปิดหลังจากที่ login สำเร็จ
      this.router.navigate([ '/logindev' ], {queryParams: {page: this.QueryParamX}});
      // Navigate to component B
      // this.router.navigate(['main/request/create/' + this.requestType + '/i'], {
      //   state: { requestDetails: navigationExtras }
      // });
    }
    else {
      this.router.navigate([ '/logindev' ]);
    }

    //this.router.navigate([url]);
  }

  forceToPageLoginWeb() {
    //window.location.href = "http://ebiz.frankenly.com/login/login/login";
    this.router.navigate([ '/logindev' ]);
  }
  hideErrorBox() {
    console.log("EEE")
    this.errorBox.sts = false;
    this.forceToPageLogin();
  }

  showMessage(txt) {
    console.log("SSSS")
    this.message.sts = true
    this.message.text = txt
  }

  hideMessage() {
    console.log("XXX")
    this.message.sts = false
  }

  showConfirm(txt, success) {
    this.confirmBox.success = success
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  showConfirmIn(txt) {
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  hideConfirm(isSuccess: Boolean) {
    this.confirmBox.sts = false
    if (isSuccess) {
      this.confirmBox.success();
    }
  }

  showConfirmTextbox(txt, success) {
    this.confirmTextBox.success = success
    this.confirmTextBox.text = txt
    this.confirmTextBox.sts = true
  }

  hideConfirmTextbox(isSuccess: Boolean) {
    this.confirmTextBox.sts = false
    if (isSuccess) {
      this.confirmTextBox.success(this.confirmTextBox.input);
    }
    this.confirmTextBox.input = ""
  }

  handleLogout() {
    console.log('logout');
    const lg = () => {
      this.authenHttp.logout().subscribe(value => {
        console.log(value)
      })

      localStorage[ "token" ] = ""
      localStorage[ "user" ] = ""
      this.forceToPageLoginWeb()
    }
    this.showConfirm("Are you sure you want to logout?", lg)

  }

  activeProject(m) {
    if (m == 1) {

    }
  }

  openModalx(templateX: TemplateRef<any>, types: string) {
    // openModalx(types: string) {
    //console.log(types);
    this.editTypes = types;
    //this.tp_clone = templateX;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,

    };
    //console.log(this.template)
    this.modalRef = this.modalService.show(templateX, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');

  }
}
