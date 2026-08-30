import argparse

from metricmoney.parsing import parse_metro_38900
from metricmoney.shared import pprint_json
from metricmoney.visualize import hello_graph


def main():
    parser = argparse.ArgumentParser(description="Metric Money CLI")
    parser.add_argument('mode', choices=['data', 'family-types', 'hello-graph'])
    parser.add_argument('--family-type', '-ft', help="Specify the family type, use 'family-types' mode to see available options")
    args = parser.parse_args()

    match args.mode:
        case 'data':
            data = parse_metro_38900()
            if args.family_type:
                try:
                    pprint_json(data[args.family_type])
                except KeyError:
                    print(f"Invalid family type: {args.family_type}")
            else:
                pprint_json(data)
                
        case 'family-types':
            data = parse_metro_38900()
            pprint_json(list(data.keys()))
        case 'hello-graph':
            
            hello_graph('dist/hello_graph.png')
        case _:
            print(f'invalid mode: {args.mode}')
            
if __name__ == "__main__":
    main()
