import os

from flask import Flask, render_template, url_for, send_from_directory
from flask_socketio import SocketIO, emit

# settings
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='./build')

socketio = SocketIO(app)
# doc: https://flask-socketio.readthedocs.io/en/latest/

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    socketio.run(app, use_reloader=True, port=5000)