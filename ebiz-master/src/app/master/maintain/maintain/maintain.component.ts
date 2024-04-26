import { Component, forwardRef, Inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { NgxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { AuthenService } from 'src/app/http/authen/authen.service';
import { MasterComponent } from '../../master/master.component';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';

@Component({
  selector: 'app-maintain',
  templateUrl: './maintain.component.html',
  styleUrls: ['./maintain.component.css']
})
export class MaintainComponent implements OnInit {

  profile = {
    username: "Mr.Attaphon ADB-Thailand",
    images: "assets/filedata/profile/zattaphonso/avatar-m-1.png",
    user_admin: false
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

  success;

  DOC_ID: string = "";
  TYPES: string = "";

  menuList = [{
    token_login: "",
    pagename: "travelerhistory",
    menuname: "Traveler History",
    url: "/master/travelerhistory",
    display: true
  },
  {
    token_login: "",
    pagename: "airticket",
    menuname: "Air Ticket",
    url: "/master/airticket",
    display: true
  },
  {
    token_login: "",
    pagename: "accommodation",
    menuname: "Accommodation",
    url: "/master/accommodation",
    display: true
  },
  {
    token_login: "",
    pagename: "visa",
    menuname: "VISA",
    url: "/master/visa",
    display: true
  },
  {
    token_login: "",
    pagename: "passport",
    menuname: "Passport",
    url: "/master/passport",
    display: true
  },
  {
    token_login: "",
    pagename: "allowance",
    menuname: "Allowance",
    url: "/master/allowance",
    display: true
  },
  {
    token_login: "",
    pagename: "reimbursement",
    menuname: "Reimbursement",
    url: "/master/reimbursement",
    display: true
  },
  {
    token_login: "",
    pagename: "travelinsurance",
    menuname: "Travel Insurance",
    url: "/master/travelinsurance",
    display: true
  },
  {
    token_login: "",
    pagename: "isos",
    menuname: "ISOS",
    url: "/master/isos",
    display: true
  },
  {
    token_login: "",
    pagename: "transportation",
    menuname: "Transportation",
    url: "/master/transportation",
    display: true
  },
  {
    token_login: "",
    pagename: "travelexpense",
    menuname: "Travel Expense",
    url: "/master/travelexpense",
    display: true
  },
  {
    token_login: "",
    pagename: "feedback",
    menuname: "Feed back",
    url: "/master/feedback",
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


  constructor(
    // @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private route: ActivatedRoute,
    private authenHttp: AuthenService,
    private router: Router,
    private zone: NgZone,
    //private _NgxZendeskWebwidgetService: NgxZendeskWebwidgetService,
    private fb: FormBuilder,
    public ws: AspxserviceService
  ) { 
    this.didCheckTokenDied();
  }

  ngOnInit() {

  }

  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)

  }

  getParameter() {
    this.route.params.subscribe(params => {

      this.DOC_ID = params["id"]
      this.route.snapshot.paramMap.get('t') === 'detail' ? this.TYPES = 'detail' : this.TYPES = 'view';
      console.log('---Action types---');
      console.log(this.TYPES);


      if (this.DOC_ID != "") {
        console.log('router events')
        let routerX = this.router.url.split("/");
        console.log(routerX);

        if (routerX.length === 3) {
          let pagename = this.checkParams();
          this.zone.run(() => this.router.navigate(['/master', this.DOC_ID, pagename]));
        }
        else if (routerX.length === 4) {
          this.zone.run(() => this.router.navigate(['/master', this.DOC_ID, routerX[3].toLowerCase()]));
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

    if (this.DOC_ID != "") {

      // return "/master/" + this.DOC_ID + "/" + page.toLowerCase();
      return "/maintain/" +  page.toLowerCase();
    }
    else {

      return "/maintain/" +  page.toLowerCase();
    }
  }

  didCheckTokenDied() {
    const onSuccess = (dao) => {
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

  didFetchProfile() {
    console.log("didFetchProfile")
    const onSuccess = (dao) => {
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
      console.log(dao)
    }
    this.ws.onFetchUserProfile().subscribe(dao => onSuccess(dao))
  }

  forceToPageLogin() {
    // window.location.href = "http://10.224.43.14/WEBEbiz2/logintest.aspx";
    this.router.navigate(['/logindev']);
  }
  forceToPageLoginWeb() {
    //window.location.href = "http://ebiz.frankenly.com/login/login/login";
    this.router.navigate(['/logindev']);
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
    const lg = () => {
      this.authenHttp.logout().subscribe(value => {
        console.log(value)
      })

      localStorage["token"] = ""
      localStorage["user"] = ""
      this.forceToPageLoginWeb()
    }
    this.showConfirm("Do you want to logout?", lg)

  }

  activeProject(m) {
    if (m == 1) {

    }
  }

  

}
