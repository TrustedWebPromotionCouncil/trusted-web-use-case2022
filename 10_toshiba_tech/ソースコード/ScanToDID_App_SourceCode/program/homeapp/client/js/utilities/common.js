
function getCookie(key) {
    let value = '; ' + document.cookie;
    console.log('document cookie' + document.cookie);
    let parts = value.split('; ' + key + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
}

function scan_event_reciever(event) {
    console.log('event_reciever');
    console.log('test callback');
    console.log('event type:' + event.eventname);


    if (event.eventname == 'StartJob') {
        document.getElementById('scan_footer_buttons').classList.add('hide');
        create_sending_element();
        console.log(JSON.stringify(event.data.params));
        file_name = event.data.params.scan_to_app_storage_parameter.file_output_method.file_name;
        console.log(file_name);
    } else if (event.eventname == 'CloseUI') {
        console.log('closed WebAPIWithUI screen:' + event.data);
    } else if (event.eventname == 'CompleteJob') {
        console.log(JSON.stringify(event.data));
        if (event.data.status_reason == 'success') {
            serverRequest(_webapiContextRoot + "/session/current/timer", "PATCH", false, function (response, error) {
                if (response) {
                    console.log('@/session/current/timer paused succeeded');
                } else {
                    console.log('@/session/current/timer failed:');
                    console.log("status: " + error.status + ", error: " + error.error);
                }
            }, { status: "paused" });

            let requestURL = _servletBaseURL + "/POST_Transfer";
            let transfer_info = { id: user_id, serial: mfp_serial, location: mfp_location, file_name: file_name, did: target_did };
            console.log(JSON.stringify(transfer_info));
            serverRequest(requestURL, "POST", true, function (response, error) {
                transfer_status = ""
                transfer_response = ""
                if (response) {
                    console.log('@/POST_Transfer: ' + response.status);
                    transfer_status = response.status;
                    transfer_response = response.response;
                } else {
                    console.log('@/POST_Transfer failed');
                    transfer_status = "FAILED";
                }
                let sending_screen = document.getElementById('sending_screen');
                document.body.removeChild(sending_screen);
                create_scan_result_element(transfer_status, transfer_response);

                serverRequest(_webapiContextRoot + "/session/current/timer", "PATCH", true, function (response, error) {
                    if (response) {
                        console.log('@/session/current/timer resumed succeeded');
                    } else {
                        console.log('@/session/current/timer failed:');
                        console.log("status: " + error.status + ", error: " + error.error);
                    }
                }, { status: "resumed" });
            }, transfer_info);
        } else {
            let sending_screen = document.getElementById('sending_screen');
            document.body.removeChild(sending_screen);
            document.getElementById('scan_footer_buttons').classList.remove('hide');
        }
    }
}

function serverRequest(URL, method, asyncStatus, callback, jsonData) {
    console.log("Request URL: " + URL + ", Method: " + method);

    if (jsonData) {
        jsonData = JSON.stringify(jsonData);
        console.log("POST Data : " + jsonData);
    }

    let appToken = {};
    appToken["X-WebAPI-AccessToken"] = apitoken;

    $.ajax({
        url: URL,
        type: method,
        async: asyncStatus,
        headers: appToken,
        data: jsonData,
        contentType: "application/json",
        dataType: "json",
        cache: true,
        success: function (response) {
            console.log("Response Data: " + JSON.stringify(response));
            callback(response);
        },
        error: function (xhr, status, error) {
            console.error(xhr.status + ', ' + status + ', ' + error);
            console.error(xhr.responseText);
            callback(null, { "xhr": xhr, "status": status, "error": error });
        }
    });
}

function kill_unid() {
    console.log('call kill_unid')
    let requestURL = _servletBaseURL + "/kill_unid";
    serverRequest(requestURL, "POST", false, function (response, error) {
        if (response) {
            console.log('@/kill_unid: ' + response.status);
        } else {
            console.log('@/kill_unid failed');
        }
    }, {});
}