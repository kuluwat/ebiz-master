import {Injectable} from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';

@Injectable({
  providedIn: 'root'
})
export class LoadListService {

  constructor(private https: HttpmanagerService) { }

  dateStrings(date: Date) {
    var d = new Date(date)
    var m = (d.getMonth() + 1) + ""
    var mm = m.length == 1 ? "0" + m : m
    var day = (d.getDate()) + ""
    var dayS = day.length == 1 ? "0" + day : day
    var result = d.getFullYear() + "-" + mm + "-" + dayS
    if (result == "NaN-NaN-NaN") {
      return ""
    } else {
      return result
    }
  }

  onFetch(type: String, country_id: string, business_date: any, status: string, keyword: string) {

    let data = {
      "token_login": localStorage[ "token" ],//"xxxx",
      "type": type,
      "country_id": country_id == undefined ? "" : country_id,
      "business": {
        "start": business_date && business_date.length == 2 ? this.dateStrings(business_date[ 0 ]) : "",
        "stop": business_date && business_date.length == 2 ? this.dateStrings(business_date[ 1 ]) : ""
      },
      "status": status == undefined ? "" : status,
      "keyword": keyword == undefined ? "" : keyword
    }
    console.log(data);

    return this.https.onFetch("LoadDocList", data)
  }

  onCopy(id: string) {

    let data = {
      "token": localStorage[ "token" ],
      "id_doc": id
    }
    console.log(data);

    return this.https.onFetch("copyDoc", data)
  }
}
