function getDevices() {
    params = {
        'url': '/get-devices',
        'type': 'GET',
        'data': {}
    }

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

function switchDevice(id) {
    params = {
        'url': '/switch-device',
        'type': 'POST',
        'data': {
            'key': id
        }
    }

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



function getPlaylists() {

    params = {
        'url': '/playlists',
        'type': 'GET',
        'data': {}
    }

    requestData(params).then((res) => {
        console.log(res);
        res['playlists'].forEach((playlist) => {
            $('#playlistData').append(
                "<div class=\"row\" style=\"padding-top:5px;padding-bottom:15px;\" onClick=\"playPlaylist( \'" + playlist.name + "\', \'" + playlist.id + "\')\">" +
                "<div class=\"col-3\">" +
                "<img src=\"" + playlist.image + "\" class=\"img-fluid\" alt=\"Responsive image\">" +
                "</div>" +
                "<div class=\"col-9\">" +
                "<div class=\"row\">" +
                "<div class=\"col-12\">" + playlist.name + "</div>" +
                "<div class=\"col-12\">" + playlist.total + "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            )
        })
    }, (err) => {
        console.log(err)
    })
}

function getLikedSongs() {
    params = {
        'url': '/load-liked-songs',
        'type': 'GET',
        'data': {}
    }

    requestData(params).then((res) => {
        $('#playlistHeading')[0].innerText = "Liked Songs";
        $('#playlistData').empty();
        var cnt = 1;

        res['songs'].forEach((song) => {
            $('#playlistData').append(
                "<div class=\"row\" style=\"padding-top:5px;padding-bottom:15px;\" onClick=\"playSong(\'" + song.uri + "\', \'" + song.image + "\'," + cnt + ", 'playlistData')\">" +
                "<div class=\"col-3\">" +
                "<img src=\"" + song.image + "\" class=\"img-fluid\" alt=\"Responsive image\">" +
                "</div>" +
                "<div class=\"col-9\">" +
                "<div class=\"row\">" +
                "<div id=\"name" + cnt + "\" class=\"col-12\">" + song.name + "</div>" +
                "<div id=\"artist" + cnt + "\" class=\"col-12\">" + song.artist + "</div>" +
                "<div class=\"col-12\">" + msConversion(song.duration) + "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            )

            cnt++;
        })
    }, (err) => {
        console.log(err)
    })
}
