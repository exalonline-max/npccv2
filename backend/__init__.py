"""Package marker for the backend package.

This file ensures the `backend` directory is treated as a Python package so
``gunicorn backend.app:app`` can import the module using the package path.
"""


