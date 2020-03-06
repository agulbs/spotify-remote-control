var params;

// play chosen song & set in status bar
// songUri: {string} song uri
// image: {string} link to album image
// id: {int} song row number
// idField: {string} id-key for div
function playSong(songUri, image, id, idField) {
    params = {
        'url': '/new-song',
        'type': 'POST',
        'data': {
            'key': songUri
        }
    }

    // adjusts footer display data
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
// songName: {string} name of the song
// image: {string} link to album image
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
// millis: {int} song length in milliseconds
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