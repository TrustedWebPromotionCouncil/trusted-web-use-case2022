function get_scan_default_param() {
    let securepdf_setting = {};
    let ocr_settings_scan = {};
    let file_output_method = { 'securepdf_setting': securepdf_setting };
    let scan_appstorage_parameter = { 'file_output_method': file_output_method, 'storage_path': '/scan', 'ocr_settings': ocr_settings_scan };
    let image_adjustment_parameter = {};
    let scan_parameter = { 'image_adjustment_parameter': image_adjustment_parameter };
    let scan_default_params = { 'scan_parameter': scan_parameter, 'scan_to_app_storage_parameter': scan_appstorage_parameter };

    scan_parameter['scan_color_mode'] = "auto";
    image_adjustment_parameter['scan_rotation'] = "angle0";
    scan_parameter['scan_resolution'] = "dpi100";
    scan_parameter['duplex_type'] = "simplex";
    image_adjustment_parameter['image_mode'] = "text_photo";
    scan_parameter['generate_preview'] = "true";
    scan_parameter['omit_blank_page'] = "false";
    file_output_method['output_file_format'] = "pdf_multi";
    securepdf_setting['is_enabled'] = false;
    securepdf_setting['encryption_level'] = "256bit_aes";
    ocr_settings_scan['primary_language'] = "japanese";
    ocr_settings_scan['secondary_language'] = "english";

    return scan_default_params;
}

function scan_setting_show() {
    let scan_footer_buttons = document.getElementById('scan_footer_buttons');
    if (!scan_footer_buttons) {
        create_scan_buttons();
        create_did_info_element();
        add_scan_event();
    } else {
        scan_footer_buttons.classList.remove('hide');
    }

    serverRequest(_webapiContextRoot + "/session/current/user", "GET", true, function (response, error) {
        if (response) {
            user_id = response.name;
        } else {
            user_id = '';
            console.log('@/session/current/user failed:');
            console.log("status: " + error.status + ", error: " + error.error);
        }
    });

    serverRequest(_webapiContextRoot + "/mfpdevice/capability", "GET", true, function (response, error) {
        if (response) {
            mfp_serial = response.serial_no;
        } else {
            console.log('@/mfpdevice/capability failed:');
            console.log("status: " + error.status + ", error: " + error.error);
        }
    });

    serverRequest(_webapiContextRoot + "/setting/controllers/system", "GET", true, function (response, error) {
        if (response) {
            mfp_location = response.physical_location;
        } else {
            console.log('@/setting/controllers/system failed:');
            console.log("status: " + error.status + ", error: " + error.error);
        }
    });

    kill_status = kill_unid();
    console.log('call activate_unid');
    let requestURL_serv = _servletBaseURL + "/activate_unid";
    serverRequest(requestURL_serv, "POST", false, function (response, error) {
        if (response) {
            console.log('@/activate_unid: ' + response.status);
            activate_status = response.status;
        } else {
            console.log('@/activate_unid failed');
        }
    }, {});

    let requestURL = _servletBaseURL + "/POST_CreateDID";
    let info = {};
    serverRequest(requestURL, "POST", true, function (response, error) {
        if (response) {
            console.log('@/POST_CreateDID: ' + response.did);
            let source_did_text = document.getElementById('source_did');
            while (source_did_text.firstChild) {
                source_did_text.removeChild(source_did_text.firstChild)
            }
            var source_did_content = document.createTextNode(response.did);
            source_did_text.appendChild(source_did_content);
        } else {
            console.log('@/POST_CreateDID failed');
        }
    }, info);
}

function create_scan_buttons() {
    let buttons_area = document.createElement('div');
    let button_left = document.createElement('div');
    let button_right = document.createElement('div');
    let call_scan_api_button = document.createElement('div');

    buttons_area.setAttribute('id', 'scan_footer_buttons');
    call_scan_api_button.setAttribute('id', 'call_scan_api_button');

    call_scan_api_button.textContent = 'Call Scan API';
    call_scan_api_button.classList.add('app-button', 'button');
    buttons_area.classList.add('button-container');
    button_left.classList.add('button-container-left');
    button_right.classList.add('button-container-right');

    button_right.appendChild(call_scan_api_button);
    buttons_area.appendChild(button_left);
    buttons_area.appendChild(button_right);

    document.body.appendChild(buttons_area);
}

function callback_scan(event) {
    console.log('call back scan func is called.');
    console.log('test event data:' + event);
}

function add_scan_event() {
    document.getElementById('call_scan_api_button').addEventListener('click', function () {
        var api_helper = new WEBAPI.helper(appid, apitoken);
        var app_info = { "icon": "/images/appicon.png", "name": "SCAN-TO-DID" };
        var job_params = get_scan_default_param();
        var include_params = { "scan_parameter": { "image_adjustment_parameter": {} }, "scan_to_app_storage_parameter": { "file_output_method": {} } };
        var exclude_params = { "scan_parameter": { "image_adjustment_parameter": {} }, "scan_to_app_storage_parameter": { "file_output_method": {} } };
        var callback_func_scan = scan_event_reciever;
        var params = { app_info: app_info, job_params: job_params, include_params: include_params, exclude_params: exclude_params };
        console.log(JSON.stringify(params, null, '\t'));
        api_helper.loadScanPage(params, callback_func_scan);
    });
}

function create_did_info_element() {

    let did_area = document.createElement('div');
    let source_did_area = document.createElement('div');
    let target_did_area = document.createElement('div');
    let source_did_label = document.createElement('p');
    let target_did_label = document.createElement('label');
    let did_form = document.createElement('form');
    let source_did_text = document.createElement('p');
    let target_did_text = document.createElement('input');

    did_form.setAttribute('id', 'did_form');
    source_did_text.setAttribute('id', 'source_did');
    source_did_label.setAttribute('id', 'source_did_label');
    target_did_text.setAttribute('id', 'target_did');
    target_did_label.setAttribute('for', 'target_did');


    var source_did_label_content = document.createTextNode('Source DID:\u00a0');
    source_did_label.appendChild(source_did_label_content);
    var source_did_content = document.createTextNode('did:example:source');
    source_did_text.appendChild(source_did_content);

    target_did_label.textContent = 'Target DID:\u00a0';
    target_did_text.type = 'text';
    target_did_text.value = target_did;

    source_did_area.appendChild(source_did_label);
    source_did_area.appendChild(source_did_text);
    target_did_area.appendChild(target_did_label);
    target_did_area.appendChild(target_did_text);

    source_did_label.classList.add('source_did_container');
    source_did_text.classList.add('source_did_container', 'source_did_text_container');
    target_did_area.classList.add('clear')
    target_did_text.classList.add('did_input');

    did_form.appendChild(source_did_area);
    did_form.appendChild(target_did_area);

    did_area.appendChild(did_form);
    did_area.classList.add('did_container');

    document.body.appendChild(did_area);
}
