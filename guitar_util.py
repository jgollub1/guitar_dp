from collections import defaultdict
import midi # run 'pip install python-midi' in venv
import sys

STARTS = [53,58,63,68,72,77] # starts on first fret of each string
RANGES = [12,12,12,14,18,18] # fret range of each string
FINGERS = [1,2,3,4]
# NOTE_COUNT = 1000

# just consider fret and finger 
def compute_cost(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    expected_fret = fret1 + (finger2 - finger1)
    return (fret2 - expected_fret)**2

# just consider fret and finger and string
def compute_cost2(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    return

# just consider fret and finger and string and position
def compute_cost3(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    return

def compute_path(sequence):
	# keys: n, (string, fret, finger)
	final_paths = defaultdict(dict)
	final_paths[0] = dict(zip(sequence[0], [(0, [seq]) for seq in sequence[0]])) # set one-note paths to zero cost
	for i, current_positions in enumerate(sequence[1:]):
	    
	    # find lowest-cost path to each position
	    for current_tup in current_positions:
	        local_min = sys.maxint
	        for prev_tup, (prev_cost, prev_seq) in final_paths[i].iteritems():
	            seq_cost = prev_cost + compute_cost(prev_tup, current_tup)
	            if seq_cost < local_min:
	                local_min, min_path = seq_cost, prev_seq + [current_tup]
	        final_paths[i+1][current_tup] = (local_min, min_path)
	
	return final_paths[i+1]

def generate_path(fname):
	events = midi.read_midifile(fname)[0]
	notes = [event.data[0] for event in events if event.name == "Note On"] # add 12 move up an octave for guitar
	print 'note length', len(notes)

	string_d = defaultdict(list)
	for i, start in enumerate(STARTS):
	    for j in range(RANGES[i]):
	        string_d[start+j] += [(i+1, j+1)]
	
	sequence = []
	for note in notes:
		tups = string_d[note]
		sequence += [[(s, fret, finger) for s, fret in tups for finger in FINGERS]]

	final_paths = compute_path(sequence)
	sorted_paths = sorted(final_paths.values(), key=lambda x: x[0])
	optimal_path = sorted_paths[0][1]
	return optimal_path

def reformat(path):
	return [".".join([str(string), str(fret)]) for string, fret, finger in path]

