var returnData;


$('#iconified').on('keyup', function() {
    var input = $(this);
    if (input.val().length === 0) {
        input.addClass('empty');
    } else {
        input.removeClass('empty');
    }
});


$(document).ready(() => {

    var params = {
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


    $('#search').on('keypress', (e) => {
        if (e.which === 13) {
            params = {
                'url': '/song',
                'type': 'POST',
                'data': {
                    'key': e.target.value
                }
            }

            requestData(params).then((res) => {
                $('#searchResultData').empty();
                var cnt = 1;

                res['songs'].forEach(song => {
                    $('#searchResultData').append(
                        "<div class=\"row\" style=\"padding-top:5px;padding-bottom:15px;\" onClick=\"playSong(\'" + song.uri + "\', \'" + song.image + "\'," + cnt + ")\">" +
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

    $('#playPause').on('click', (e) => {
        var value = e.target.classList[1].split('-')[1];
        params = {
            'url': '/music-controls',
            'type': 'POST',
            'data': {
                'key': value
            }
        }

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


function playSong(songUri, image, id) {
    params = {
        'url': '/new-song',
        'type': 'POST',
        'data': {
            'key': songUri
        }
    }

    requestData(params).then((res) => {
        $('#searchResultData').children().each((idx, item) => {
            $('#name' + (idx + 1)).css('color', '#ededed')
        });

        $('#name' + id).css('color', 'green')

        var songName = $('#name' + id)[0].innerText;
        setCurrSong(songName, image)
    }, (err) => {
        alert('No Device Selected')
        return false;
    });
}


function setCurrSong(songName, image) {
    $('#currSongName')[0].innerText = songName
    $("#currSongImage").attr("src", image);
    $('#playPause')[0].classList.value = "fas fa-pause"
}


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


async function requestData(params) {
    return await request(params);
}


function request(params) {
    return $.ajax({
        url: params['url'],
        type: params['type'],
        contentType: "application/json",
        data: JSON.stringify(params['data'])
    });
}