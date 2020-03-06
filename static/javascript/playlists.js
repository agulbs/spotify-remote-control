var params;

// Gets all playlist that the user has liked/favorited
function getPlaylists() {

    params = {
        'url': '/playlists',
        'type': 'GET',
        'data': {}
    }

    // write data to view
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


// gets all liked songs
function getLikedSongs() {
    params = {
        'url': '/load-liked-songs',
        'type': 'GET',
        'data': {}
    }

    // write data to view
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

// loads playlist data
function playPlaylist(playlist, id) {
    params = {
        'url': '/load-playlist',
        'type': 'POST',
        'data': {
            'id': id
        }
    }

    // write data to view
    requestData(params).then((res) => {
        $('#playlistHeading')[0].innerText = playlist;
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