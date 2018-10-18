from flask import render_template, request
from app import app
from guitar_util import *
from midi import read_midifile

# every time these routes get hit, runs index()
@app.route('/')
def index():
    # user = {'username': 'Miguel'}
    # posts = [{'author': {'username': 'John'},'body': 'Beautiful day in Portland!'},
    #     {'author': {'username': 'Susan'},'body': 'The Avengers movie was so cool!'}]
    # notes = ['2.3','3.5','4.2','3.2','3.3','3.5']
    f_name = 'sample_files/26_2.mid'
    events = read_midifile(f_name)[0]
    notes = [event.data[0] for event in events if event.name == "Note On"] # add 12 move up an octave for guitar
    notes = generate_path(notes)
    print 'notes', notes
    # notes = [json.dumps(s) for s in notes]
    # return render_template('index_guitar.html', title='My', notes=map(json.dumps, notes))
    return render_template('index_guitar.html', title='My ', sequence=notes)

@app.route('/read_file', methods=['POST'])
def read_file():
    print 'data is...', len(request.get_json())
    note_path = request.get_json()
    notes = generate_path(note_path)
    print 'received request...len', len(notes)
    return render_template('index_guitar.html', title='My ', sequence=notes)