"""Entry point to run the Flask application.

This script imports the Flask application instance from ``app.py`` and
invokes ``app.run()`` when executed directly. It allows you to run the
development server with ``python run.py``. If you prefer using the
``flask`` command line interface, set the environment variable
``FLASK_APP=run.py`` and then execute ``flask run``.
"""

from app import app


if __name__ == '__main__':
    # Run the application in debug mode for development convenience.
    # In production, use a WSGI server such as Gunicorn or uWSGI.
    app.run(debug=True)