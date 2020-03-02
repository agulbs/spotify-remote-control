
class Devices:
    def __init__(self, id, is_active, is_private_session, is_restricted, name, type, volume_percent):
        self.id = id
        self.is_active = is_active
        self.is_private_session = is_private_session
        self.is_restricted = is_restricted
        self.name = name
        self.type = type
        self.volume_percent = volume_percent

    def controller(self, controller):
        self.controller = controller

    def to_dict(self):
        return {
            "id": self.id,
            "is_active": str(self.is_active),
            "is_private_session": str(self.is_private_session),
            "is_restricted": str(self.is_restricted),
            "name": self.name,
            "type": self.type,
            "volume_percent": str(self.volume_percent)
        }

    def __str__(self):
        return "id: " + self.id \
            + ", is_active: " + str(self.is_active) \
            + ", is_private_session: " + str(self.is_private_session) \
            + ", is_restricted: " + str(self.is_restricted) \
            + ", name: " + self.name \
            + ", type: " + self.type \
            + ", volume_percent: " + str(self.volume_percent) \
            + ", controller: " + str(self.controller)
