class Songs:
    def __init__(self, artist, name, uri, duration, popularity, release_date):
        self.artist = artist
        self.name = name
        self.uri = uri
        self.duration = duration
        self.popularity = popularity
        self.release_date = release_date

    def controller(self, controller):
        self.controller = controller

    def populairty_sort(self, songs):
        songs.sort(key=lambda x: x.count, reverse=True)
        return songs


    def __str__(self):
        return "name: " + self.name \
            + ", uri: " + self.uri \
            + ", duration: " + str(self.duration) \
            + ", popularity: " + str(self.popularity) \
            + ", release_date: " + self.release_date

    def to_dict(self):
        return {
            "name": self.name,
            "uri": self.uri,
            "duration": self.duration,
            "popularity": self.popularity,
            "release_date": self.release_date
        }
