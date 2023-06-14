
var apitoken = '';
var appid = 'bd8a8fef-efe7-487a-a0c2-ffffffffff00';
var api_helper = '';
var target_did = 'did:unid:test:EiCcGrQxwT0P7ovoRlB50xkP1XJx76P-Yl5HcA4EP-3anA'
var user_id = '';
var mfp_serial = '';
var mfp_location = '';
var file_name = '';
var activate_status = '';
var transfer_status = '';
var transfer_response = '';
var _webapiContextRoot = "http://embapp-local.toshibatec.co.jp:50187/v1.0";
var _servletBaseURL = "/server/bd8a8fef-efe7-487a-a0c2-ffffffffff00";

document.addEventListener('DOMContentLoaded', function () {
    // get api token
    apitoken = getCookie('accessToken');
    console.log('TEST web api token :' + apitoken);
    scan_setting_show();
    console.log('after call webapi scan setting');
});

window.addEventListener('unload', function () {
    console.log('Unload event occurs');
    kill_status = kill_unid();
});