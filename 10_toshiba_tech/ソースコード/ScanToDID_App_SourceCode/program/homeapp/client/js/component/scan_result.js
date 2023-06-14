function create_scan_result_element(status, response) {
    console.log('status:' + status);
    console.log('response:' + response);
    let scanjob_result_screen = document.createElement('div');
    scanjob_result_screen.setAttribute('id', 'scanjob_result_screen');
    let scanjob_result_text = document.createElement('div');
    scanjob_result_text.setAttribute('id', 'scanjob_result_text');
    let scanjob_complete_status = document.createElement('div');
    scanjob_complete_status.setAttribute('id', 'scanjob_complete_status');
    scanjob_result_text.textContent = 'Status: ' + status;

    scanjob_result_screen.classList.add('scan-job-result-area');
    scanjob_result_screen.appendChild(scanjob_result_text);
    scanjob_result_screen.appendChild(scanjob_complete_status);

    create_scan_result_fotter_buttons();
    add_scan_complete_event();

    document.body.appendChild(scanjob_result_screen);
}

function create_scan_result_fotter_buttons() {
    let buttons_area = document.createElement('div');
    let button_left = document.createElement('div');
    let button_right = document.createElement('div');
    let close_button = document.createElement('div');

    buttons_area.setAttribute('id', 'scan_result_footer_buttons');
    close_button.setAttribute('id', 'call_scan_api_button');

    close_button.textContent = 'Close';
    close_button.classList.add('app-button', 'button');
    close_button.setAttribute('id', 'scan_close_button');
    buttons_area.classList.add('button-container');
    button_right.classList.add('button-container-right');
    button_left.classList.add('button-container-left');

    buttons_area.appendChild(button_left);
    button_right.appendChild(close_button);
    buttons_area.appendChild(button_right);
    document.body.appendChild(buttons_area);
}

function add_scan_complete_event() {
    document.getElementById('scan_close_button').addEventListener('click', function () {
        let scan_result_area = document.getElementById('scanjob_result_screen');
        let result_footer_buttons = document.getElementById('scan_result_footer_buttons');
        document.body.removeChild(scan_result_area);
        document.body.removeChild(result_footer_buttons);
        scan_footer_buttons.classList.remove('hide');
    });
}

function create_sending_element() {
    console.log('create_sending_element:');
    let sending_screen = document.createElement('div');
    sending_screen.setAttribute('id', 'sending_screen');
    let sending_screen_gif = document.createElement('div');
    sending_screen_gif.setAttribute('id', 'sending_screen_gif');
    sending_screen.classList.add('scan-job-result-area');
    sending_screen.appendChild(sending_screen_gif);
    document.body.appendChild(sending_screen);
}
