from pokemon_showdown_replays import Replay, Upload

log = "C:\Users\cnico\OneDrive\Escritorio\IC\pokemon\pokemon-showdown\logs\2025-03\gen9nuevometarandom\2025-03-26\gen9nuevometarandom-383.log.json"

replay_object = Replay.create_replay_object(log, show_full_damage = True, client_location = "http://192.168.0.20:3000/testclient?~~localhost:8000#")
html = Upload.create_replay(replay_object)
