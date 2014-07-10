import json
from flask import Flask, request, jsonify
from models.board import Board

config_file = open('config.json', 'r')
config = json.load(config_file)
config_file.close()

app = Flask(__name__, static_url_path=None, static_folder='app')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/assets/<string:folder>/<string:filename>')
def static_proxy(folder, filename):
    asset = '/'.join([folder, filename])
    return app.send_static_file(asset)

@app.route('/move', methods=['POST'])
def move():  # Computer is always X
    # Get board passed in as a json object
    data = request.data.decode("utf-8")
    board_inplay = json.loads(data)

    # Create board and get next move
    board = Board(board_inplay['board'])
    state, move = board.minimax('X')

    return jsonify({'move': move, 'state': state})


if __name__ == '__main__':
    app.run(host=config['host'], port=config['port'], debug=['debug'])