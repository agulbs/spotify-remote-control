from flask import Flask, request, jsonify, redirect, session, render_template
from spotipy.oauth2 import SpotifyClientCredentials
from flask_cors import CORS
from pprint import pprint
import requests
import spotipy
import spotipy.util as util
from api.devices import Devices
from api.controls import Controls
from api.songs import Songs
from api.search import Search
from config import *

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)


sp = None
controller = None
songs = None
devices = []
search = None

@app.route("/")
def verify():
    """
    redirects to /callback after generating authorization url
    """
    auth_url = f'{API_BASE}/authorize?client_id={CLI_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
    return redirect(auth_url)


@app.route("/callback")
def api_callback():
    """
    generates oAuth token & redirects to index
    """
    session.clear()
    code = request.args.get('code')

    auth_token_url = f"{API_BASE}/api/token"
    res = requests.post(auth_token_url, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/callback",
        "client_id": CLI_ID,
        "client_secret": CLI_SEC
    })

    res_body = res.json()
    session["toke"] = res_body.get("access_token")

    return redirect("index")


@app.route("/index")
def index():
    """
    initialize application variables & controllers
    ----------------------------------------------

    sp: spotify object
    search: used to make calls to spotify api
    device: current active device
    devices: list of all devices
    controller: controls device & music state
    """
    global sp
    global search
    global device
    global devices
    global controller

    sp = spotipy.Spotify(auth=session['toke'])
    search = Search(sp)
    devices = [Devices(**device) for device in sp.devices()['devices']]

    if len(devices) == 0:
        return render_template("index.html")

    for device in devices:
        if device.is_active:
            controller = Controls(sp, device)
            break

    if controller is None:
        controller = Controls(sp, devices[0])

    return render_template("index.html")

@app.route("/library")
def library():
    """
    renders library view
    """
    return render_template("library.html")

@app.route("/devices")
def devices():
    return render_template("devices.html")


@app.route("/load-playlist", methods=["POST"])
def load_playlist():
    """
    retrieves songs for requsted playlist
    -------------------------------------

    songs: songs in requested playlist
    """
    r = request.json['id']
    songs = search.load_playlist(r)
    return jsonify({'songs':songs, 'status':"200"})


@app.route("/playlists", methods=["GET"])
def playlists():
    """
    retrieves all playlists liked by user
    -------------------------------------

    playlists: all user liked playlists
    """
    playlists = search.user_playlists()
    return jsonify({'playlists': playlists, 'status': "200"})


@app.route("/liked-songs", methods=["GET"])
def liked_songs():
    """
    retrieves all songs liked by user
    ---------------------------------

    songs: all liked songs
    """
    songs = search.liked_songs()
    return jsonify({'songs':songs, 'status':"200"})


@app.route("/current-playback", methods=["GET"])
def current_playback():
    """
    retrieves current song being played
    -----------------------------------

    song: current song
    """
    song = search.current_playback()
    if song == 0:
        return jsonify({'song': {}, 'status': "400"})
    return jsonify({'song': song, 'status': "201"})

@app.route("/get-devices", methods=["GET"])
def get_devices():
    """
    get all available devices
    -------------------------

    d: list of devices
    """
    global devices

    devices = [Devices(**device) for device in sp.devices()['devices']]
    d = []
    for device in devices:
        d.append(device.to_dict())

    pprint(d)

    return jsonify({'devices': d, 'status': "201"})


@app.route("/switch-device", methods=["POST"])
def switch_device():
    """
    switches to new device based on device_id
    """

    global controller

    r = request.json['key']
    controller.switch_device(r)

    devices = [Devices(**device) for device in sp.devices()['devices']]
    for device in devices:
        if device.is_active:
            controller = Controls(sp, device)
            break


    return "201"


@app.route("/song", methods=["POST"])
def lookup_song():
    """
    preforms a lookup for songs by name & songs by artist
    -----------------------------------------------------

    songs: list of songs
    """

    r = request.json['key']

    search = Search(sp)
    songs = search.song(r)

    return jsonify({'songs': songs}), 200


@app.route("/new-song", methods=["POST"])
def new_song():
    """
    plays a new song
    """

    r = request.json['key']
    controller.start_playback([r])

    return "200"


@app.route("/music-controls", methods=["POST"])
def music_controls():
    """
    controls state of device
    ------------------------

    d: list of devices
    """
    global songs

    r = request.json['key']

    if r == "play":
        controller.play()

    if r == "allDevices":
        d = [device.to_dict() for device in devices]
        return jsonify({'devices': d}), 200

    if r == "pause":
        controller.pause()

    if r == "volumeDown":
        controller.volume(False)

    if r == "volumeUp":
        controller.volume(True)

    return "200"


if __name__ == '__main__':
    app.run( debug=True)
