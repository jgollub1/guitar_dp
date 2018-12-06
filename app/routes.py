from flask import render_template, request
from app import app
from guitar_util import *

@app.route('/')
def index():
    return render_template('index.html', title='My ', sequence=[])

@app.route('/read_file', methods=['POST'])
def read_file():
    note_path = request.get_json()
    notes = generate_path(note_path)
    return ','.join(notes)
