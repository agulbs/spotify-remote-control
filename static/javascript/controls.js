var params;

// Controls state for all inputs
$(document).ready(() => {

    // Get current song queue. Always ran to help prevent no
    // device errors
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

    // hide search icon when user is typing
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