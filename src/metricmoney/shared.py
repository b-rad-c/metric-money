import json

def pretty_json(data) -> str:
	return json.dumps(data, indent=4, sort_keys=True)

def pprint_json(data) -> None:
	print(pretty_json(data))
