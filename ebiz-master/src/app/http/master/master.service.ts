import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private https: HttpmanagerService) { }

  onFetchCompany() {
    let data = {
      "token_login": localStorage["token"]//"xxxx"
    }
    return this.https.onFetch("Company", data)
  }

  onFetchContinent() {
    let data = {
      "token_login": localStorage["token"]//"xxxx"
    }
    return this.https.onFetch("Continent", data)
  }

  onFetchCountry(continentId) {
    let data = {
      "token_login": localStorage["token"],//"xxxx",
      "continent": continentId
    }
    console.log(data)
    return this.https.onFetch("Country", data)
  }

  onFetchProvince(){
    let data = {
      "token_login": localStorage["token"]//"xxxx"
    }
    return this.https.onFetch("Province", data)
  }

  onFetchRequestStatus() {
    let data = {
      "token_login": localStorage["token"]//"xxxx"
    }
    return this.https.onFetch("RequestType", data)
  }


  onSearchEmployee(id: String, name: String){
    let data = {
      "token_login": localStorage["token"],//"xxxx",
      "emp_id": id,
      "emp_name": name
    }
    return this.https.onFetch("empSearch", data)
  }

  onProcessTravelDay(type: String, start: String, stop: String, country: any[]){
    var data = {
      "token_login": localStorage["token"],//"xxxx",
      "type": type,
      "start_date": start,
      "stop_date": stop,
      "country": []
    }

    country.forEach( current => {
      data.country.push({
        "id": current+""
      })
    })

    console.log(data)
    return this.https.onFetch("getTravelDay", data)
  }

}
