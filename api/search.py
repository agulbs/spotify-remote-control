from pprint import pprint
from .songs import Songs

class Search:
    def __init__(self, controller):
        self.controller = controller

    def song(self, song):
        results = self.controller.search(q=song, limit=50) #, type='track')
        songs = self.songs_dict(results)

        return songs

    def playlist(self, playlist):
        results = self.controller.search(q=playlist, type='playlist')
        # songs = self.format_songs(results)

        return "working on it"
        # return songs

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
            })

        return songs



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
