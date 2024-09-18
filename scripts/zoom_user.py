import json

# Define a class that maps to the JSON structure
class User:
    def __init__(self, userid, firstname, lastname, email, recordings):
        self.userid = userid
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.recordings = [Recordings(**rec) for rec in recordings]

    def __repr__(self):
        return (f"User(userid={self.userid}, firstname={self.firstname}, lastname={self.lastname}, "
                f"email={self.email}, recordings={self.recordings})")

class Recordings:
    def __init__(self, uuid, topic, start_time, duration, vtt_content, summary):
        self.uuid = uuid
        self.topic = topic
        self.start_time = start_time
        self.duration = duration
        self.vtt_content = vtt_content
        self.summary = Summary(**summary) if summary else None

    def __repr__(self):
        return (f"Recordings(uuid={self.uuid}, topic={self.topic}, start_time={self.start_time}, "
                f"duration={self.duration}, vtt_content={self.vtt_content}, summary={self.summary})")

class Summary:
    def __init__(self, summary_title, summary_overview=None, summary_details=None, next_steps=None):
        self.summary_title = summary_title
        self.summary_overview = summary_overview
        self.summary_details = summary_details if summary_details is not None else []
        self.next_steps = next_steps if next_steps is not None else []

    def __repr__(self):
        return (f"Summary(summary_title={self.summary_title}, summary_overview={self.summary_overview}, "
                f"summary_details={self.summary_details}, next_steps={self.next_steps})")