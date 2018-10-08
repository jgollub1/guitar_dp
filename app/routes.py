from flask import render_template
from app import app
from guitar_util import *

# every time these routes get hit, runs index()
@app.route('/')
@app.route('/index')
def index():
    # user = {'username': 'Miguel'}
    # posts = [{'author': {'username': 'John'},'body': 'Beautiful day in Portland!'},
    #     {'author': {'username': 'Susan'},'body': 'The Avengers movie was so cool!'}]
    # notes = ['2.3','3.5','4.2','3.2','3.3','3.5']
    notes = generate_path('sample_files/26_2.mid')
    notes = reformat(notes)
    s_len = len(notes)
    # print 'note length', s_len
    print 'notes', notes
    # notes = [json.dumps(s) for s in notes]
    # return render_template('index_guitar.html', title='My Dick', notes=map(json.dumps, notes))
    return render_template('index_guitar.html', title='My ', sequence=notes, seqLength=s_len)