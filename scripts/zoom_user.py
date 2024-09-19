"""
This module contains the classes that represent the 
JSON structure of the Zoom user and meeting data.
"""

# Define a class that maps to the JSON structure
class User:
    """
    A class to represent a user.

    Attributes:
    -----------
    userid : str
        The unique identifier for the user.
    firstname : str
        The first name of the user.
    lastname : str
        The last name of the user.
    email : str
        The email address of the user.
    recordings : list
        A list of recordings associated with the user.
    """

    def __init__(self, userid, firstname, lastname, email, recordings):
        self.userid = userid
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.recordings = [Recordings(**rec) for rec in recordings]

    def get_userid(self):
        """Returns the user ID."""
        return self.userid

    def set_userid(self, userid):
        """Sets the user ID."""
        self.userid = userid

    def get_firstname(self):
        """Returns the first name."""
        return self.firstname

    def set_firstname(self, firstname):
        """Sets the first name."""
        self.firstname = firstname

    def get_lastname(self):
        """Returns the last name."""
        return self.lastname

    def set_lastname(self, lastname):
        """Sets the last name."""
        self.lastname = lastname

    def get_email(self):
        """Returns the email address."""
        return self.email

    def set_email(self, email):
        """Sets the email address."""
        self.email = email

    def get_recordings(self):
        """Returns the list of recordings."""
        return self.recordings

    def set_recordings(self, recordings):
        """Sets the list of recordings."""
        self.recordings = [Recordings(**rec) for rec in recordings]

    def __repr__(self):
        """
        Returns a string representation of the User object.
        """
        return (
            f"User(userid={self.userid},\n"
            f"     firstname={self.firstname},\n"
            f"     lastname={self.lastname},\n"
            f"     email={self.email},\n"
            f"     recordings={self.recordings})"
        )


class Recordings:
    """
    A class to represent a recording.

    Attributes:
    -----------
    uuid : str
        The unique identifier for the recording.
    topic : str
        The topic of the recording.
    start_time : str
        The start time of the recording.
    duration : str
        The duration of the recording.
    vtt_content : str
        The VTT content of the recording.
    summary : Summary
        The summary of the recording.
    """

    def __init__(self, uuid, topic, start_time, duration, vtt_content, summary):
        self.uuid = uuid
        self.topic = topic
        self.start_time = start_time
        self.duration = duration
        self.vtt_content = vtt_content
        self.summary = Summary(**summary) if summary else None

    def get_uuid(self):
        """Returns the UUID."""
        return self.uuid

    def set_uuid(self, uuid):
        """Sets the UUID."""
        self.uuid = uuid

    def get_topic(self):
        """Returns the topic."""
        return self.topic

    def set_topic(self, topic):
        """Sets the topic."""
        self.topic = topic

    def get_start_time(self):
        """Returns the start time."""
        return self.start_time

    def set_start_time(self, start_time):
        """Sets the start time."""
        self.start_time = start_time

    def get_duration(self):
        """Returns the duration."""
        return self.duration

    def set_duration(self, duration):
        """Sets the duration."""
        self.duration = duration

    def get_vtt_content(self):
        """Returns the VTT content."""
        return self.vtt_content

    def set_vtt_content(self, vtt_content):
        """Sets the VTT content."""
        self.vtt_content = vtt_content

    def get_summary(self):
        """Returns the summary."""
        return self.summary

    def set_summary(self, summary):
        """Sets the summary."""
        self.summary = Summary(**summary) if summary else None

    def __repr__(self):
        """
        Returns a string representation of the Recordings object.
        """
        return (
            f"Recordings(uuid={self.uuid},\n"
            f"           topic={self.topic},\n"
            f"           start_time={self.start_time},\n"
            f"           duration={self.duration},\n"
            f"           vtt_content={self.vtt_content},\n"
            f"           summary={self.summary})"
        )


class Summary:
    """
    A class to represent a summary of a recording.

    Attributes:
    -----------
    summary_title : str
        The title of the summary.
    summary_overview : str, optional
        The overview of the summary.
    summary_details : list, optional
        The details of the summary.
    next_steps : list, optional
        The next steps mentioned in the summary.
    """

    def __init__(self, summary_title, summary_overview=None, summary_details=None, next_steps=None):
        self.summary_title = summary_title
        self.summary_overview = summary_overview
        self.summary_details = summary_details if summary_details is not None else []
        self.next_steps = next_steps if next_steps is not None else []

    def get_summary_title(self):
        """Returns the summary title."""
        return self.summary_title

    def set_summary_title(self, summary_title):
        """Sets the summary title."""
        self.summary_title = summary_title

    def get_summary_overview(self):
        """Returns the summary overview."""
        return self.summary_overview

    def set_summary_overview(self, summary_overview):
        """Sets the summary overview."""
        self.summary_overview = summary_overview

    def get_summary_details(self):
        """Returns the summary details."""
        return self.summary_details

    def set_summary_details(self, summary_details):
        """Sets the summary details."""
        self.summary_details = summary_details

    def get_next_steps(self):
        """Returns the next steps."""
        return self.next_steps

    def set_next_steps(self, next_steps):
        """Sets the next steps."""
        self.next_steps = next_steps

    def __repr__(self):
        """
        Returns a string representation of the Summary object.
        """
        return (
            f"Summary(summary_title={self.summary_title},\n"
            f"        summary_overview={self.summary_overview},\n"
            f"        summary_details={self.summary_details},\n"
            f"        next_steps={self.next_steps})"
        )
