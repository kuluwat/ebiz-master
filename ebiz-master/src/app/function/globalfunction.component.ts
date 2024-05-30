import { DatePipe } from "@angular/common";
import { AuthenService } from "../http/authen/authen.service";
import { Router } from "@angular/router";
import { AspxserviceService } from "../ws/httpx/aspxservice.service";



export function formatDateTime( date : Date) {
    var dt = new Date(date);
    
    var montF = new DatePipe('en-US');
    
    return montF.transform(dt, 'dd MMM yyyy');
}

export function gotoPage(docid: string, page: string): string {
    if (docid !== "") {
      return `/master/${docid}/${page.toLowerCase()}`;
    } else {
      return `/master/${page.toLowerCase()}`;
    }
  }

export function gotoMaintainPage(pagename: string) {
  return `/maintain/${pagename.toLocaleLowerCase()}`
}

export const CloneDeep = (obj: object) => {
    let data = null;
    try {
      data = JSON.parse(JSON.stringify(obj));
    } catch (ex) { }
    return data;  
}

type AuthAdmin = { emp_id: any; userSelected: any; status_trip_cancelled: any };
export const useAuth = (data: any, userSelected: string): AuthAdmin | null => {
    let obj: AuthAdmin | null = null; // Initialize obj as null
    const emp_list = data.emp_list;
  
    if (emp_list && emp_list.length > 0) {
      let findIndex = emp_list.findIndex((emp: { emp_id: string }) => emp.emp_id === userSelected);
  
      if (findIndex > -1) {
        let status_trip_cancelled = emp_list[findIndex].status_trip_cancelled;
        obj = { emp_id: userSelected, userSelected, status_trip_cancelled };
      } else {
        // If userSelected is not found, default to the first item in emp_list
        let status_trip_cancelled = emp_list[0].status_trip_cancelled === null ? true : emp_list[0].status_trip_cancelled;
        obj = { emp_id: emp_list[0].emp_id, userSelected: emp_list[0].emp_id, status_trip_cancelled };
      }
    }
  
    return obj;
  }

  export const getBoolean = (value: any) => {
    let converBoolSet: { [key: string]: boolean } = {
      true: true,
      false: false,
      on: true,
      yes: true,
    };
    let boolcheck: boolean | null = null;
    try {
      boolcheck = converBoolSet[value];
      !boolcheck && (boolcheck = false);
    } catch (ex) {
      boolcheck = false;
    }
    return boolcheck;
  }

  export function get_index_by_id(ds: any[], emp_id: string, id?: string) {
    if (ds.length > 0) {
        return ds.findIndex((res: any) => {
            return res.emp_id === emp_id && (id ? res.id === id : true);
        });
    }
    return false;
}

export function fetchProfile (username: any, img:any, user_admin: any,authenHttp: AuthenService,router: Router) {

  
        const onSuccess = (dao : any) => {
          if (dao.length == 0) {
            // redirect
            //alert('dao.length == 0')
        forceToPageLogin(router)
          }
          username = dao[0]["empName"]
          img = dao[0]["imgUrl"]
          user_admin = dao[0]["user_admin"]
          //this.profile.username = "xxxxx"
          //this.profile.images = "http://srieng02/pic/TOP/579.jpg"
        }
        authenHttp.onFetchUserProfile().subscribe((dao: any) => onSuccess(dao), (_error: any) => alert("Error : Login profile."))

}

export function forceToPageLogin (router: Router) {
        // window.location.href = "http://10.224.43.14/WEBEbiz2/logintest.aspx";
    
        //window.location.href = "http://ebiz.frankenly.com/login/login/login";
        router.navigate(['/logindev']);
     
}

export function forceToPageLoginWeb(router: Router) {
  //window.location.href = "http://ebiz.frankenly.com/login/login/login";
  router.navigate(['/logindev']);
}

export function didCheckTokenDied(ws: AspxserviceService , username: any, img:any, user_admin : any,authenHttp: AuthenService,router: Router) {
  const onSuccess = (dao : any) => {
    console.log(dao)
    if (dao["msg_sts"] == "S") {
      // authen
      console.log("authen")
      fetchProfile(username, img,user_admin,authenHttp,router);
    } else {
      // TODO ::
      forceToPageLogin(router)
      // redirect to login pages
      // set localStorage to guest
    }
  }
  ws.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))
  // this.authenHttp.onCheckToken().subscribe(dao => onSuccess(dao), error => alert("Can't connect server, please check connect VPN."))

}

export function getDocStatus(
  emp_id: string,
  emp_list: any[],
  TrackingStatus: any[],
  Status: number
): boolean {
  let id = 1;
  if (emp_list.length > 0) {
    let dt = emp_list.find((item: any) => item.emp_id === emp_id);
    if (dt) {
      id = Number(dt.doc_status_id);
      if (Status === id) {
        TrackingStatus[Status] = true;
      }
    }
  }
  return TrackingStatus[Status];
}

  