import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public https: HttpmanagerService) { }

  // onCheckToken() {
  //   let data = {
  //     "token_login": "xxxxxx"
  //   }

  //   return this.https.onFetch("login", data)
    
  // }

  // onFetchUserProfile(){
  //   let data = {
  //     "token_login": "xxxxxx"
  //   }
  //   return this.https.onFetch("loginProfile", data)
  // }
}
