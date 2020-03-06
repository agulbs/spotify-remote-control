var params;

// Gets a list of devices spotify is currently being ran on
function getDevices() {
    params = {
        'url': '/get-devices',
        'type': 'GET',
        'data': {}
    }

    // write data to view
    requestData(params).then((res) => {
        $('#deviceData').empty();
        res['devices'].forEach((device) => {

            $('#deviceData').append(
                "<div class=\"row\" style=\"padding-top:5px;padding-bottom:15px;\" onClick=\"switchDevice(\'" + device.id + "\')\">" +
                "<div class=\"col-3 d-flex justify-content-end\">Name:</div>" +
                "<div class=\"col-9\">" + device.name + "</div>" +
                "<div class=\"col-3 d-flex justify-content-end\">Type:</div>" +
                "<div class=\"col-9\">" + device.type + "</div>" +
                "<div class=\"col-3 d-flex justify-content-end\">Is Active:</div>" +
                "<div class=\"col-9\" id=\"" + device.id + "\">" + device.is_active + "</div>" +
                "</div>"
            );
        })
    }, (err) => console.log(err))

}


// Switches between devices
// id: {string} device id
function switchDevice(id) {
    params = {
        'url': '/switch-device',
        'type': 'POST',
        'data': {
            'key': id
        }
    }

    // switch the device
    requestData(params).then((res) => {
        var ch = $('#deviceData')[0].children;
        for (var c of ch) {
            c.children[5].innerText = 'False'
        }

        $('#' + id)[0].innerText = 'True';
    }, (err) => {
        console.log(err)
    })
}