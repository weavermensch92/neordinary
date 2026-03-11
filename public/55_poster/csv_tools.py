import json
import csv
import sys
from collections import defaultdict

def json_to_csv(json_path, nodes_csv_path, links_csv_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    nodes = data.get('nodes', [])
    links = data.get('links', [])
    
    if nodes:
        node_keys = list(nodes[0].keys())
        with open(nodes_csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=node_keys)
            writer.writeheader()
            writer.writerows(nodes)
            
    if links:
        link_keys = list(links[0].keys())
        with open(links_csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=link_keys)
            writer.writeheader()
            writer.writerows(links)
            
    print(f"Extracted {len(nodes)} nodes to {nodes_csv_path}")
    print(f"Extracted {len(links)} links to {links_csv_path}")

def csv_to_json(nodes_csv_path, links_csv_path, json_path):
    data = {'nodes': [], 'links': [], 'dict': defaultdict(list)}
    
    with open(nodes_csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            for k, v in row.items():
                try:
                    row[k] = float(v) if '.' in v else int(v)
                except ValueError:
                    pass
                if v == "NaN":
                    row[k] = "NaN"
            
            # Auto-generate dict for left sidebar
            category_val = str(row.get('category', '')).strip()
            if category_val and category_val != "None":
                data['dict'][category_val].append(row.get('id', ''))
            
            data['nodes'].append(row)
            
    with open(links_csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data['links'].append(row)
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"Created {json_path} from CSVs")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python csv_tools.py [export|import]")
        sys.exit(1)
        
    action = sys.argv[1]
    if action == 'export':
        json_to_csv('data.json', 'nodes.csv', 'links.csv')
    elif action == 'import':
        csv_to_json('nodes.csv', 'links.csv', 'data.json')
    else:
        print("Unknown action")
