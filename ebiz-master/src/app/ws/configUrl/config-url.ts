import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class ConfigUrl {

    onServer = "PRD";

    /*** DEV ***/
    private baseUrl_api_dev: string = 'http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/API/';
    private baseUrl_asmx_dev: string = 'http://tbkc-dapps-05.thaioil.localnet/Ebiz2/generalService.asmx/';
    private baseUrl_pase1_dev: string = 'http://tbkc-dapps-05.thaioil.localnet/ebiz/api/';
    private url_carservice_dev: string = 'http://tbkc-dapps-05.thaioil.localnet/Transport/web/carservice_requestform.aspx?';
    private url_ebiz_dev: string = 'http://tbkc-dapps-05.thaioil.localnet/Ebiz2/';


    /*** PRD ***/
    private baseUrl_api_prd: string = 'https://e-biztravel.thaioilgroup.com/ebiz_ws/API/';
    private baseUrl_asmx_prd: string = 'https://e-biztravel.thaioilgroup.com/Ebiz2/generalService.asmx/';
    private baseUrl_pase1_prd: string = 'https://e-biztravel.thaioilgroup.com/ebiz/api/';
    private url_carservice_prd: string = 'https://carservice.thaioilgroup.com/web/carservice_requestform.aspx?';
    private url_ebiz_prd: string = 'https://e-biztravel.thaioilgroup.com/Ebiz2/';


    baseUrl_asmx() {
        return this.onServer === 'DEV' ? this.baseUrl_asmx_dev : this.baseUrl_asmx_prd;
    }
    baseUrl_api() {
        return this.onServer === 'DEV' ? this.baseUrl_api_dev : this.baseUrl_api_prd;
    }
    baseUrl_pase1_api() {
        return this.onServer === 'DEV' ? this.baseUrl_pase1_dev : this.baseUrl_pase1_prd;
    }
    url_carservice() {
        return this.onServer === 'DEV' ? this.url_carservice_dev : this.url_carservice_prd;
    }
    url_ebiz() {
        return this.onServer === 'DEV' ? this.url_ebiz_dev : this.url_ebiz_prd;
    }
}
