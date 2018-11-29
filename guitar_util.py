from collections import defaultdict
import midi # run 'pip install python-midi' in venv
import sys

STARTS = [53,58,63,68,72,77] # starts on first fret of each string
RANGES = [12,12,12,14,18,18] # fret range of each string
TOTAL_RANGE = STARTS[-1] - STARTS[0] + RANGES[-1]
FINGERS = [1,2,3,4]

'''
just consider fret and finger 
'''
def compute_cost(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    expected_fret = fret1 + (finger2 - finger1)
    return (fret2 - expected_fret)**2

'''
just consider fret and finger and string
'''
def compute_cost2(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    return

'''
just consider fret and finger and string and position
'''
def compute_cost3(tup1, tup2):
    string1, fret1, finger1 = tup1
    string2, fret2, finger2 = tup2
    return

'''
move up/down octaves into guitar range if necessary
'''
def nearest_note(low_n, high_n, note):
	if note < low_n:
		return (note - low_n) % 12  + low_n
	elif note > high_n:
		return high_n - (high_n - note) % 12
	return note

'''
keys: n, (string, fret, finger)
'''
def compute_path(sequence):
	final_paths = defaultdict(dict)
	final_paths[0] = dict(zip(sequence[0], [(0, [seq]) for seq in sequence[0]])) # set one-note paths to zero cost
	for i, current_positions in enumerate(sequence[1:]):
	    # print i, current_positions
	    # find lowest-cost path to each position
	    for current_tup in current_positions:
	        local_min = sys.maxint
	        for prev_tup, (prev_cost, prev_seq) in final_paths[i].iteritems():
	            seq_cost = prev_cost + compute_cost(prev_tup, current_tup)
	            if seq_cost < local_min:
	                local_min, min_path = seq_cost, prev_seq + [current_tup]
	        final_paths[i+1][current_tup] = (local_min, min_path)
	
	return final_paths[i+1]

'''
reformat to match s.fret on html fretboard
'''
def reformat(path):
	return [".".join([str(string), str(fret)]) for string, fret, finger in path]

'''
generate an optimal path with dynamic programming algorithm
'''
def generate_path(notes):
	string_d = defaultdict(list)
	for i, start in enumerate(STARTS):
	    for j in range(RANGES[i]):
	        string_d[start+j] += [(i+1, j+1)]
	
	sequence = []
	for note in notes:
		note = nearest_note(STARTS[0], STARTS[0] + TOTAL_RANGE, note)
		tups = string_d[note]
		sequence += [[(s, fret, finger) for s, fret in tups for finger in FINGERS]]
	final_paths = compute_path(sequence)
	sorted_paths = sorted(final_paths.values(), key=lambda x: x[0])
	optimal_path = sorted_paths[0][1]
	return reformat(optimal_path)
