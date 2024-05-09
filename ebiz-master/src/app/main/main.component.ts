import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../http/authen/authen.service';
import { AspxserviceService } from '../ws/httpx/aspxservice.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  profile = {
    username: "",
    images: ""
  }

  isLoading = false;
  message = {
    sts: false,
    text: "เข้าสู่ระบบสำเร็จ"
  }

  messageInfo = {
    sts: false,
    text: ""
  }

  confirmBox = {
    sts: false,
    text: "XXXX",
    success: null
  }

  confirmBoxInfo = {
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

  errorBox ={
    sts: false,
    text: "Error : "
  }

  success : any ;

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

  constructor(
    private authenHttp: AuthenService,
    private router: Router,
    public ws:AspxserviceService
  ) {
    // console.log("Login Success")
    // localStorage["token"] = "bec0e2a0-226b-4c9e-83e2-2dfe2f2c2fed"
    // localStorage["user"] = "username"
    this.didCheckTokenDied()
  }

  ngOnInit() {
    // this.didCheckTokenDied()
  }

  didCheckTokenDied() {
    const onSuccess = (dao : any) => {
      console.log(dao)
      if (dao["msg_sts"] == "S") {
        // authen
        this.didFetchProfile();
      } else {
        // TODO ::
        this.forceToPageLogin()
        // redirect to login pages
        // set localStorage to guest
      }
    }
    this.authenHttp.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))
  }

  didFetchProfile() {
    const onSuccess = (dao : any) => {
      if (dao.length == 0) {
        // redirect
        //alert('dao.length == 0')
        this.forceToPageLogin()
      }
      this.profile.username = dao[0]["empName"]
      this.profile.images = dao[0]["imgUrl"]
      //this.profile.username = "xxxxx"
      //this.profile.images = "http://srieng02/pic/TOP/579.jpg"
    }
    this.authenHttp.onFetchUserProfile().subscribe(dao => onSuccess(dao), error => alert("Error : Login profile."))
  }

  forceToPageLogin() {
    // window.location.href = "http://10.224.43.14/WEBEbiz2/logintest.aspx";

    //window.location.href = "http://ebiz.frankenly.com/login/login/login";
    this.router.navigate(['/logindev']);
  }
  forceToPageLoginWeb() {
    //window.location.href = "http://ebiz.frankenly.com/login/login/login";
    this.router.navigate(['/logindev']);
  }

  hideErrorBox() {
    console.log("EEE")
    this.errorBox.sts = false;
    this.forceToPageLogin();
  }

  showErrorBox(txt : string) {
    console.log("SSSS")
    this.errorBox.sts = true
    this.errorBox.text = txt
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

  showMessageInfo(txt : string) {
    console.log("SSSS")
    this.messageInfo.sts = true
    this.message.text = txt
  }

  hideMessageInfo() {
    console.log("XXX")
    this.messageInfo.sts = false
  }

  showConfirm(txt : any, success: any) {
    this.confirmBox.success = success
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  showConfirmInfo(txt: string, success: any) {
    this.confirmBoxInfo.success = success
    this.confirmBoxInfo.text = txt
    this.confirmBoxInfo.sts = true
  }

  showConfirmIn(txt: string) {
    this.confirmBox.text = txt
    this.confirmBox.sts = true
  }

  hideConfirm(isSuccess: Boolean) {
    this.confirmBox.sts = false
    if (isSuccess) {
      // this.confirmBox.success();
    }
  }

  hideConfirmInfo(isSuccess: Boolean) {
    this.confirmBoxInfo.sts = false
    if (isSuccess) {
      // this.confirmBoxInfo.success();
    }
  }

  showConfirmTextbox(txt : any, success : any) {
    this.confirmTextBox.success = success
    this.confirmTextBox.text = txt
    this.confirmTextBox.sts = true
  }

  hideConfirmTextbox(isSuccess: Boolean) {
    this.confirmTextBox.sts = false
    if (isSuccess) {
      // this.confirmTextBox.success(this.confirmTextBox.input);
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
    this.showConfirm('Do you want to logout?', lg)

  }
}
