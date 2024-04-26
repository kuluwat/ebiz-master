import { Injectable } from '@angular/core';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import { HttpmanagerService } from '../../services/http/httpmanager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private https: HttpmanagerService) { }
  
  onCheckToken() {
    let data = {
      "token_login": localStorage["token"]//"xxxxxx"
    }

    return this.https.onFetch("login", data)
    
  }

  onLogin(user, pass){
    let data = {
      "user": user,
      "pass": pass
    }
    console.log(data)
    return this.https.onFetch("loginWeb", data)
  }

  logout(){
    let data = {
      "token": localStorage["token"]
    }
    console.log(data)
    return this.https.onFetch("logout", data)
  }

  onFetchUserProfile(){
    let data = {
      "token_login": localStorage["token"]//"bec0e2a0-226b-4c9e-83e2-2dfe2f2c2fed"
    }
    console.log(data)
    return this.https.onFetch("loginProfile", data)
  }
}
