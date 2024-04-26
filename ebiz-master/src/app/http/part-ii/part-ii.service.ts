import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';

@Injectable({
  providedIn: 'root'
})
export class PartIiService {

  constructor(private https: HttpmanagerService) {

  }

  onSave(data: any) {
    console.log('data to docFlow2');
    console.log(JSON.stringify(data))
    console.log(data)
    return this.https.onFetch("docFlow2", data)
  }

  // didGenerateDocument(state: String) {
  //   let data = {
  //     "token_login": "xxxx",
  //     "doc_type": state
  //   }
  //   return this.https.onFetch("genDocNo", data)
  // }

  didFetch(document_id) {
    let data = {
      "token_login": localStorage["token"],
      "id_doc": document_id
    }
    console.log(">>> send to LoadDocDetail2 <<<");
    console.log(data);
    return this.https.onFetch("LoadDocDetail2", data)
  }

  requestApproverCalculator(document_id, list) {
    let data = {
      "token_login": localStorage["token"],
      "doc_no": document_id,
      "traveler_list": list
    }
    console.log('Call TravelerSummary')
    console.log(data)
    return this.https.onFetch("TravelerSummary", data)
  }

  checkPassport(doc, id) {
    let data = {
      "token_login": localStorage["token"],
      "doc_no": doc,
      "emp_id": id
    }
    return this.https.onFetch("EstimateExpense", data)
  }
}
