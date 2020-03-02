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
    device: current active device
    devices: list of all devices
    controller: controls device & music state
    """
    global sp
    global device
    global devices
    global controller

    sp = spotipy.Spotify(auth=session['toke'])

    devices = [Devices(**device) for device in sp.devices()['devices']]
    for device in devices:
        if device.is_active:
            controller = Controls(sp, device)
            break

    return render_template("index.html")


@app.route("/devices", methods=["GET"])
def devices():
    """
    get all available devices
    -------------------------

    d: list of devices
    """
    global devices

    d = []

    for device in devices:
        d.append(device.to_dict())

    return jsonify({'devices': d, 'status': "201"})


@app.route("/switch-device", methods=["POST"])
def switch_device():
    """
    switches to new device based on device_id
    """

    r = request.json['key']
    controller.switch_device(r)

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
    app.run(debug=True)
