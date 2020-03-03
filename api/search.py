from pprint import pprint
from .songs import Songs


class Search:
    def __init__(self, controller):
        self.controller = controller

    def current_playback(self):
        result = self.controller.current_playback()
        if result is not None:
            return self.song_dict(result)
        return 0
        # song = self.song_dict(result)
        # return song

    def song(self, song):
        results = self.controller.search(q=song, limit=50)
        songs = self.songs_dict(results)

        return songs

    def liked_songs(self):
        results = self.controller.current_user_saved_tracks()
        liked_songs = self.liked_songs_dict(results)
        pprint(liked_songs)

    def user_playlists(self):
        results = self.controller.current_user_playlists()
        pprint(results)
        playlists = self.playlists_dict(results)
        return playlists

    def format_songs(self, result):
        songs = []

        for song in result['tracks']['items']:
            songs.append({
                'artist': song['album']['artists'][0]['name'],
                'name': song['name'],
                'uri': song['uri'].replace('album', 'track'),
                'duration': song['duration_ms'],
                'popularity': song['popularity'],
                'release_date': song['album']['release_date'],
            })

        return songs

    def songs_dict(self, result):
        songs = []

        for song in result['tracks']['items']:
            songs.append({
                'artist': song['album']['artists'][0]['name'],
                'name': song['name'],
                'uri': song['uri'],
                'duration': song['duration_ms'],
                'popularity': song['popularity'],
                'release_date': song['album']['release_date'],
                'image': song['album']['images'][0]['url']
            })

        return songs

    def song_dict(self, result):
        return {
            'artist': result['item']['album']['artists'][0]['name'],
            'name': result['item']['name'],
            'uri': result['item']['uri'],
            'duration': result['item']['duration_ms'],
            'popularity': result['item']['popularity'],
            'release_date': result['item']['album']['release_date'],
            'image': result['item']['album']['images'][0]['url']
        }

    def playlists_dict(self, result):
        playlists = []
        pprint(result)
        for playlist in result['items']:
            playlists.append({
                'name': playlist['name'],
                'image': playlist['images'][0]['url'],
                'tracks': playlist['href'],
                'total': playlist['tracks']['total'],
                'description': playlist['description']
            })

        return playlists

    def liked_songs_dict(self, result):
        all_songs = []
        songs = result['items']

        while result['next']:
            result = self.controller.next(result)
            songs.extend(result['items'])

        for song in songs:
            all_songs.append({
                'artist': song['track']['album']['artists'][0]['name'],
                'name': song['track']['album']['name'],
                'uri': song['track']['uri'],
                'duration': song['track']['duration_ms'],
                'popularity': song['track']['popularity'],
                'release_date': song['track']['album']['release_date'],
                'image': song['track']['album']['images'][0]['url']
            })

        return all_songs


# def format_songs(self, result):
#     songs = []
#     for song in result['tracks']['items']:
#         songs.append(Songs(**{
#             'name': song['album']['name'],
#             'uri': song['album']['uri'],
#             'duration': song['duration_ms'],
#             'popularity': song['popularity'],
#             'release_date': song['album']['release_date']
#         }))
#
#     while result['tracks']['next']:
#         try:
#             self.controller.next(result['tracks'])
#             for song in result['tracks']['items']:
#                 songs.append(Songs(**{
#                     'name': song['album']['name'],
#                     'uri': song['album']['uri'],
#                     'duration': song['duration_ms'],
#                     'popularity': song['popularity'],
#                     'release_date': song['album']['release_date']
#                 }))
#         except:
#             break
#
#     return songs
