"""Main Flask application for the Grass Detector.

This application serves three pages:

* A landing page with a call-to-action encouraging users to "touch grass".
* A capture page that accesses the user's webcam using the MediaDevices API
  and performs a simple colour thresholding algorithm to detect green pixels.
* A success page that congratulates the user when grass has been detected.

The detection logic is entirely client-side JavaScript; the Flask server
serves static assets and templates without processing image data. This
keeps the backend lightweight and secure.
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def landing() -> str:
    """Render the landing page."""
    return render_template('landing.html')


@app.route('/capture')
def capture() -> str:
    """Render the camera capture page."""
    return render_template('capture.html')


@app.route('/success')
def success() -> str:
    """Render the success page shown after detecting grass."""
    return render_template('success.html')