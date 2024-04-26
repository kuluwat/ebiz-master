import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigUrl } from '../../ws/configUrl/config-url';

@Injectable({
  providedIn: 'root'
})
export class HttpmanagerService {

  //baseUrl: string = 'http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/API/'

  // baseUrl: string = 'http://10.224.43.14/ebiz/api/'
  baseUrl: string = ''

  constructor(
    private http: HttpClient,
    private urlWs: ConfigUrl ) { }

  // onFetch(method: String, data: any) { return this.http.post<any>("http://103.76.180.38/TKPI/api/" + method, data) }
  onFetch(method: String, data: any): Observable<any> { 
    this.baseUrl = this.urlWs.baseUrl_pase1_api();
    return this.http.post<any>(this.baseUrl + method, data) 
  }
}
