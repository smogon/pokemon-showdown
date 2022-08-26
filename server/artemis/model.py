# This file handles the actual processing of messages,
# and sends them back to the parent process.
# @author: mia-pi-git
from detoxify import Detoxify;
import sys;
import time;
import json;

model_name = 'unbiased'
debug = False

if "multilingual" in sys.argv:
	model_name = 'multilingual'
elif "small" in sys.argv:
	model_name += '-small'

if "debug" in sys.argv:
	debug = True

model = Detoxify(model_name)

def now():
	return int(time.time() * 1000)

logfile = open("logs/artemis.log", "a")
def log(message):
	if debug:
		logfile.write(f"{str(now())}:{str.rstrip(message)}\n")
		logfile.flush()

print("ready", flush=True)
log("ready")
try:
	for line in sys.stdin:
		log(f"in:{line}")
		parts = line.split("|")
		out = f"{parts.pop(0)}|"
		try:
			res = model.predict("|".join(parts))
			for key in res: res[key] = str(res[key]) # json.dumps doesn't like floats
			out += json.dumps(res)
		except BaseException as e:
			out += json.dumps({'error': f"{e}"})

		log(f"out:{out}")

		print(out, flush=True)
except BaseException as e:
	print("error|" + json.dumps({'error': f"{e}"}))
	log(f"majorerror:{e}")

