import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigUrl } from '../configUrl/config-url';
import { AspxserviceService } from '../httpx/aspxservice.service';

@Injectable({
  providedIn: 'root',
})
export class FileuploadserviceService {
  //baseUrl: string = 'http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/api/UploadFile'
  baseUrl: string = '';
  constructor(private http: HttpClient, private ws: AspxserviceService, private urlWs: ConfigUrl) { }

  postFile(fileToUpload: File, file_doc: string, file_page: string, file_emp: string): Observable<any> {

    this.baseUrl = this.urlWs.baseUrl_api();
    const endpoint = 'UploadFile';

    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);
    return this.http.post<any>(this.baseUrl + endpoint, fd);
    //return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
  }

  postFilePhase2(
    fileToUpload: File,
    file_doc: string,
    file_page: string,
    file_emp: string,
    file_token_login: string
  ): Observable<any> {
    this.baseUrl = this.urlWs.baseUrl_api();
    const endpoint = 'UploadFile';

    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);
    fd.append('file_token_login', file_token_login);
    // return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
    return this.http.post<any>(this.baseUrl + endpoint, fd);
  }

  postFile_Custom(
    fileToUpload: File,
    file_doc: string,
    file_page: string,
    file_emp: string,
    element: any
  ): Observable<any> {
    //debugger;
    this.baseUrl = this.urlWs.baseUrl_api();
    const endpoint = 'UploadFile';

    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);

    element.forEach((ele : any) => {
      fd.append(ele.param, ele.value);
    });

    return this.http.post<any>(this.baseUrl + endpoint, fd);
    //return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
  }

  postFile_Phase1(fileToUpload: File, file_doc: string, file_page: string, file_emp: string): Observable<any> {

    const endpoint = 'UploadFile';
    const apiUrl = this.urlWs.baseUrl_pase1_api(); //'http://TBKC-DAPPS-05.thaioil.localnet/ebiz/api/UploadFile';

    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);
    // console.log('>>> fd <<<');
    // console.log(fd);
    return this.http.post<any>(apiUrl+ endpoint, fd);
  }
}
