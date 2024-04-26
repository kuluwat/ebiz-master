import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../../../../http/authen/authen.service';
import { LoginService } from '../../../../http/login/login.service';
import { AspxserviceService } from '../../../../ws/httpx/aspxservice.service';

declare var $: any;

@Component({
  selector: 'app-logindev',
  templateUrl: './logindev.component.html',
  styleUrls: ['./logindev.component.css']
})
export class LogindevComponent implements OnInit {

  model = {
    username: "",
    password: "",
    error: ""
  }
  isLoading: boolean = false

  classApplied = false;
  countPassword = 0;

  brandingLogo = "/Ebiz2/assets/logo.png"
  QueryParamX = "";
  params_tk = "";
  params_us = "";

  registerForm: FormGroup;
  submitted = false;

  constructor(
    public loginService: LoginService,
    private route: ActivatedRoute,
    private authen: AuthenService,
    private router: Router,
    private ws: AspxserviceService,
    private formBuilder: FormBuilder
  ) {

    //   $(".toggle-password").click(function () {

    //     $(this).toggleClass("fa-eye fa-eye-slash");
    //     var input = $($(this).attr("toggle"));
    //     if (input.attr("type") == "password") {
    //         input.attr("type", "text");
    //     } else {
    //         input.attr("type", "password");
    //     }
    // });
  }

  ngOnInit() {

    console.log('***check param***')
    this.route.queryParams.subscribe(params => {
      this.QueryParamX = this.route.snapshot.queryParamMap.get('page');
      this.params_tk = this.route.snapshot.queryParamMap.get('tk');
      this.params_us = this.route.snapshot.queryParamMap.get('us');

      console.log(this.QueryParamX);
      console.log(this.params_tk);
      console.log(this.params_us);
      console.log(params);
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });

    //alert(window.location.href);
    console.log(window.location.href.split("/"))

    if (this.ws.urlWs.onServer === "DEV") {
      this.brandingLogo = this.checkPathForDevServer();
    }else{
      this.brandingLogo = this.checkPathForDevServer();
    }

    if ((this.params_tk != "" && this.params_tk != null) && (this.params_us != "" && this.params_us != null)) {
      this.route.params.subscribe(params => this.onLogin(this.params_tk, this.params_us));
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.handleBtnLogin();
    //alert('SUCCESS!! :-)')
  }

  showHidePassword() {
    //alert('xx');

    this.classApplied = !this.classApplied

  }

  checkPathForDevServer() {
    var sp = window.location.href.split("/");
    //let url = "/assets/logo.png";
    let url = "/Ebiz2/assets/logo.png";
    console.log('url')
    console.log(sp)
    if (sp.length > 0) {
      if (sp[2] === "localhost:4200") {
        url = "/assets/logo.png";
      }else{
        url = "/Ebiz2/assets/logo.png";
      }
    }
    return url;
  }

  onLogin(token: string, user: string) {
    console.log('fn onLogin');
    if (token == "login" || token == undefined) {
      alert(token + " || " + user)
      return
    }
    localStorage["token"] = token;
    localStorage["token_login"] = token;
    localStorage["user"] = user;
    console.log(token)
    console.log(user)
    localStorage["login_show_message"] = "true"

    //ถ้ามี page parameter มาให้ redirect ไปหน้านั้น ถ้าไม่มีให้วิ่งเข้าหน้าแรก
    if (this.QueryParamX != "" && this.QueryParamX != null) {
      console.log("QueryParamX = " + this.QueryParamX)
      this.router.navigate([this.QueryParamX]);
    }
    else {
      // this.router.navigate(["/main/services"]);
      this.router.navigate(["/ebizhome"]);
    }
  }

  handleBtnLogin() {
    this.isLoading = true
    if (
      this.model.username == "" ||
      this.model.password == ""
    ) {
      this.isLoading = false
      this.model.error = "Please input value"
    } else {
      this.ws.onLoginDev(this.model.username, this.model.password).subscribe(status => {
        //this.authen.onLogin(this.model.username, this.model.password).subscribe(status => {
        console.log("***After click btn login***");
        console.log(status);
        this.isLoading = false
        if (status["token"] != "" && status["msg_sts"] === "true") {

          this.onLogin(status["token"], status["user"])
        } else {
          //this.model.error = "Login fail!"
          this.model.error = status["msg_txt"];
        }
        //alert('xxxx')
      }, error => {
        this.isLoading = false
        this.model.error = "Can't connect server."
        console.log(error)
      })
    }
  }
  onLoginListenerSuccess(result) {
    console.log(result)
  }

}
