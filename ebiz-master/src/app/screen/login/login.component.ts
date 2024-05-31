import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../http/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../../http/authen/authen.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = {
    username: "",
    password: "",
    error: ""
  }
  constructor(
    public loginService: LoginService, 
    private route: ActivatedRoute,
    private authen: AuthenService,
    private router: Router) { }

  ngOnInit() {
    // this.loginService.onCheck("aaaa", "bbbb").subscribe(result => this.onLoginListenerSuccess(result)) 
    // this.route.params.subscribe(params => this.onLogin(params["token"], params["user"]));
  }

  onLogin(token: string, user: string){
    if(token == "login" || token == undefined){
      return
    }
    localStorage["token"] = token
    localStorage["user"] = user
    console.log(token)
    console.log(user)
    localStorage["login_show_message"] = "true"
    this.router.navigate(["/main/services"]);
  }

  handleBtnLogin(){
    if(
      this.model.username == "" ||
      this.model.password == "" 
    ) {
      this.model.error = "Please input value"
    }else{
      this.authen.onLogin(this.model.username, this.model.password).subscribe(status => {
        if(status["token"] != ""){
          this.onLogin(status["token"], status["user"])
        }else{
          this.model.error = "Login fail!"
        }
      }, error => {
        this.model.error = "Can't connect server."
        console.log(error)
      })
    }
  }
  onLoginListenerSuccess(result : any) {
    console.log(result)
  }

}
