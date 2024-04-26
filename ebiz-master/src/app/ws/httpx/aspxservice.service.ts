import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import * as fs from 'file-saver';
import { ConfigUrl } from '../configUrl/config-url';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AspxserviceService {

  //onServer: string = "DEV"

  // baseUrl: string = 'http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/API/';

  // baseUrl_asmx: string = 'http://tbkc-dapps-05.thaioil.localnet/Ebiz2/generalService.asmx/'; // 'http://localhost:50474/generalService.asmx/' //

  baseUrl: string = '';

  baseUrl_asmx: string = ''; 


  //'http://tbkc-dapps-05.thaioil.localnet/Transport/web/ws_carservice.asmx/'; //'http://localhost:64308/web/ws_carservice.asmx/'//

  constructor(
    private http: HttpClient,
    public urlWs: ConfigUrl
  ) {

  }


  callWs(param: any, method: string): Observable<any> {
    debugger;
    this.baseUrl = this.urlWs.baseUrl_api();
    return this.http.post<any>(this.baseUrl + method, param)
  };
  //callWs(param: any, method: string): Observable<any> {return this.http.post<any>(this.baseUrl + method, param, httpOptions)};

  callWs_asmx(params: any, fnName: string, method: string): Observable<any> {
    this.baseUrl_asmx = this.urlWs.baseUrl_asmx();
    let body = { method: method, param: JSON.stringify([params]) };
    console.log('***Parameter for asmx***');
    console.log(body);
    return this.http.post<any>(this.baseUrl_asmx + fnName, body, httpOptions);
  }

  excel_report(params: any, jsondata: any, fnName: string, method: string): Observable<any> {
    this.baseUrl_asmx = this.urlWs.baseUrl_asmx();//'http://localhost:50474/generalService.asmx/';//this.urlWs.baseUrl_asmx();
    let body = { method: method, param: JSON.stringify([params]), jsondata: jsondata };
    console.log('***Excel Report***');
    console.log(body);
    return this.http.post<any>(this.baseUrl_asmx + fnName, body, httpOptions);
  }

  handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  onLoginDev(user, pass) {
    let data = {
      "user": user.toUpperCase(),
      "pass": pass
    }
    //console.log(data)
    console.log(this.baseUrl);
    return this.callWs(data, "loginWeb")
  }

  // onloginProfile(){
  //   let data = {
  //     "token_login": localStorage["token"]//"bec0e2a0-226b-4c9e-83e2-2dfe2f2c2fed"
  //   }
  //   return this.callWs(data,"loginProfile")
  // }

  onCheckToken() {
    let data = {
      "token_login": localStorage["token"]//"xxxxxx"
    }

    return this.callWs(data, "login")
  }

  onLogin(user, pass) {
    let data = {
      "user": user,
      "pass": pass
    }
    console.log(data)
    return this.callWs(data, "loginWeb")
  }

  logout() {
    let data = {
      "token": localStorage["token"]
    }
    console.log(data)
    return this.callWs(data, "logout")
  }

  onFetchUserProfile() {
    let data = {
      "token_login": localStorage["token"]//"bec0e2a0-226b-4c9e-83e2-2dfe2f2c2fed"
    }
    console.log(data)
    return this.callWs(data, "loginProfile")
  }

  checkPathForDevServer(path: string) {

    var url: string = path;
    //console.log('checkPathForDevServer');
    if (this.urlWs.onServer === "DEV") {

      var sp = window.location.href.split("/");

      if (sp.length > 0) {
        if (sp[2] != "localhost:4200") {
          url = "/Ebiz2/" + path;
        }
      }
    }
    else {
      url = path;
    }
    //console.log(url);
    return url;

  }

  isEmpty(obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

  formatDate(date) {
    if (date !== undefined && date !== "") {
      var myDate = new Date(date);
      var month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][myDate.getMonth()];
      var str = myDate.getDate() + " " + month + " " + myDate.getFullYear();
      return str;
    }
    return "";
  }

  downloadFile(url, filename) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    let file_name = filename;
    // fs.saveAs(url, file_name);
  }
}
