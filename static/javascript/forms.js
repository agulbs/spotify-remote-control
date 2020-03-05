var params;

$(document).ready(() => {

    // Get current song queue
    params = {
        'url': '/current-playback',
        'type': 'GET',
        'data': {}
    }

    requestData(params).then((res) => {
        var song = res['song']
        setCurrSong(song['name'], song['image']);
    }, (err) => {
        console.log(err)
    })

    // hide search icon when chars in input
    $('#iconified').on('keyup', function() {
        var input = $(this);
        if (input.val().length === 0) {
            input.addClass('empty');
        } else {
            input.removeClass('empty');
        }
    });


    // execute a search for song/artist
    $('#search').on('keypress', (e) => {
        if (e.which === 13) {
            params = {
                'url': '/song',
                'type': 'POST',
                'data': {
                    'key': e.target.value
                }
            }

            // write data to view
            requestData(params).then((res) => {
                $('#searchResultData').empty();
                var cnt = 1;

                res['songs'].forEach(song => {
                    $('#searchResultData').append(
                        "<div class=\"row\" style=\"padding-top:5px;padding-bottom:15px;\" onClick=\"playSong(\'" + song.uri + "\', \'" + song.image + "\'," + cnt + ", 'searchResultData')\">" +
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
            })
        }
    })

    // play/pause music when icon pressed
    $('#playPause').on('click', (e) => {
        var value = e.target.classList[1].split('-')[1];
        params = {
            'url': '/music-controls',
            'type': 'POST',
            'data': {
                'key': value
            }
        }

        // swap icons accordingly
        requestData(params).then((res) => {
            if (value === "play")
                e.target.classList.value = "fas fa-pause"
            else
                e.target.classList.value = "fas fa-play"
        }, (err) => {
            console.log(err)
        })

    })
})


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

function playPlaylist(playlist, id) {
    params = {
        'url': '/load-playlist',
        'type': 'POST',
        'data': {
            'id': id
        }
    }

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


// play chosen song & set in status bar
function playSong(songUri, image, id, idField) {
    params = {
        'url': '/new-song',
        'type': 'POST',
        'data': {
            'key': songUri
        }
    }

    requestData(params).then((res) => {
        // disable all selected songs
        $('#' + idField).children().each((idx, item) => {
            $('#name' + (idx + 1)).css('color', '#ededed')
        });

        // highlight selected song
        $('#name' + id).css('color', 'green')

        var songName = $('#name' + id)[0].innerText;

        // set current song in status
        setCurrSong(songName, image)
    }, (err) => {
        alert('No Device Selected')
        return false;
    });
}


// set current song in status
function setCurrSong(songName, image) {
    console.log(songName)
    if (typeof songName === 'undefined') {
        $('#currSong').css('display', 'none')
    } else {
        $('#currSong').css('display', '')
        $('#currSongName')[0].innerText = songName
        $("#currSongImage").attr("src", image);
        $('#playPause')[0].classList.value = "fas fa-pause"
    }

}


// conver miliseconds to HH:MM:SS
function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;

    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);

    if (hrs > 0) {
        min = '' + min;
        min = ('00' + min).substring(min.length);
        return hrs + ":" + min + ":" + sec;
    } else {
        return min + ":" + sec;
    }
}


// implement async await
async function requestData(params) {
    return await request(params);
}


// execute http request
function request(params) {
    return $.ajax({
        url: params['url'],
        type: params['type'],
        contentType: "application/json",
        data: JSON.stringify(params['data'])
    });
}