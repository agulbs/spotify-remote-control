from .devices import Devices as device
from pprint import pprint
class Controls:
    def __init__(self, controller, device):
        self.controller = controller
        self.device = device

    def __str__(self):
        return str(self.device)

    def switch_device(self, device_id):
        self.controller.transfer_playback(device_id, force_play=True)

    def next_track(self):
        self.controller.next_track(self.device.id)

    def previous_track(self):
        self.controller.previous_track(self.device.id)

    def pause(self):
        try:
            self.controller.pause_playback(self.device.id)
        except:
            print("err")

    def play(self):
        try:
            self.controller.start_playback()
        except:
            print("err")

    def shuffle(self):
        self.controller.shuffle(True, self.device.id)

    def start_playback(self, uri):
        self.controller.start_playback(uris=uri)

    def volume(self, flag):
        vol = self.device.volume_percent

        if flag:
            vol += 5
            if vol > 100:
                vol = 100
        else:
            vol -= 5
            if vol < 0:
                vol = 0

        self.device.volume_percent = vol
        try:
            self.controller.volume(vol, self.device.id)
        except:
            print("err")

    def user_playlists(self, user):
        items = {}
        for item in self.device.controller.user_playlists(user)['items']:

            items[item['name']] = {
                'name': item['name'],
                'tracks': item['tracks'],
                'description': item['description'],
                'id': item['id'],
                'owner': item['owner']['display_name'],
                'uri': item['uri']
            }

        return items

    def playlist_tracks(self, playlist_id):
        pprint(self)
        print("f")

    def play_playlist(self, uri):
        self.device.controller.start_playback(context_uri=uri)
        return "f"

    def current_playback(self):
        c = self.device.controller.current_playback()
