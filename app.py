import os

from flask import Flask, render_template, url_for, send_from_directory
from flask_socketio import SocketIO, emit

# settings
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='react_app/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)