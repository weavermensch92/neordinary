import pandas as pd
import math
from csv_tools import csv_to_json
import csv

def is_nan(x):
    if isinstance(x, float) and math.isnan(x):
        return True
    if pd.isna(x):
        return True
    return False

def build_db():
    files = [3, 4, 5, 6, 7, 8, 9]
    
    nodes = []
    links = []
    
    added_nodes = set()
    added_links = set()
    
    def add_node(node):
        if node['id'] not in added_nodes:
            nodes.append(node)
            added_nodes.add(node['id'])
            
    def add_link(source, target):
        link_id = f"{source}->{target}"
        if link_id not in added_links:
            links.append({'source': source, 'target': target, 'type': 'a'})
            added_links.add(link_id)

    # Root
    root_id = "🚀 Neordinary"
    add_node({
        'id': root_id, 'label': root_id, 'role': 'Root', 'generation': '', 
        'school': '', 'description': '', 'group': '', 'category': ''
    })
    
    for n in files:
        gen_id = f"{n}generation"
        df = pd.read_excel(f"{n}.xlsx")
        
        # Generation node
        add_node({
            'id': gen_id, 'label': gen_id, 'role': 'Generation', 'generation': gen_id, 
            'school': '', 'description': '', 'group': gen_id, 'category': gen_id
        })
        add_link(root_id, gen_id)
        
        for _, row in df.iterrows():
            school = str(row['학교']) if not is_nan(row['학교']) else ''
            if not school:
                continue
                
            pos1 = str(row['포지션1']) if not is_nan(row['포지션1']) else ''
            pos2 = str(row['포지션2']) if not is_nan(row['포지션2']) else ''
            nickname = str(row['닉네임']) if not is_nan(row['닉네임']) else ''
            
            if not nickname:
                continue
                
            school_node_id = f"🏛️ {school} ({gen_id})"
            add_node({
                'id': school_node_id, 'label': school_node_id, 'role': 'School', 'generation': gen_id, 
                'school': school, 'description': '', 'group': gen_id, 'category': ''
            })
            add_link(gen_id, school_node_id)
            
            # Roles / Description
            desc = pos1
            if pos2:
                desc = f"{pos1}, {pos2}" if pos1 else pos2
                
            # Position node
            position_name = desc if desc else "Unknown Role"
            position_node_id = f"💼 {position_name} ({school}_{gen_id})"
            add_node({
                'id': position_node_id, 'label': position_name, 'role': 'Position', 'generation': gen_id, 
                'school': school, 'description': '', 'group': gen_id, 'category': ''
            })
            add_link(school_node_id, position_node_id)
                
            # Student node
            student_id = f"{nickname} ({gen_id}_{school}_{_})"
            add_node({
                'id': student_id, 'label': nickname, 'role': 'Student', 'generation': gen_id, 
                'school': school, 'description': desc, 'group': gen_id, 'category': gen_id
            })
            add_link(position_node_id, student_id)
            
    # Write to CSV
    if nodes:
        node_keys = list(nodes[0].keys())
        with open('nodes.csv', 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=node_keys)
            writer.writeheader()
            writer.writerows(nodes)
            
    if links:
        link_keys = list(links[0].keys())
        with open('links.csv', 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=link_keys)
            writer.writeheader()
            writer.writerows(links)
            
    print(f"Generated {len(nodes)} nodes and {len(links)} links.")
    
    # Update JSON
    csv_to_json('nodes.csv', 'links.csv', 'data.json')

if __name__ == "__main__":
    build_db()
