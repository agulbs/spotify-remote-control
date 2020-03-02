import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
from pprint import pprint


class Token:

    def __init__(self, client_id, client_secret, scope, username, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.scope = scope
        self.username = username
        self.redirect_uri = redirect_uri

    def __str__(self):
        return "client_id: " + self.client_id \
            + ", client_secret: " + self.client_secret \
            + ", scope: " + self.scope \
            + ", username: " + self.username \
            + ", redirect_uri: " + self.redirect_uri

    def get_token(self):
        token = util.prompt_for_user_token(
            self.username,
            self.scope,
            self.client_id,
            self.client_secret,
            self.redirect_uri
        )

        return token
