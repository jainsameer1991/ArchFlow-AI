import requests
import json
import os

FIGMA_TOKEN = "<YOUR_FIGMA_TOKEN_HERE>"  # Insert your Figma token here
FILE_KEY = "ERu1IMRL3af164jqEyRAvV"  # Updated with actual file key
JSON_FILE = "figma_file.json"  # Local Figma file JSON
OUTPUT_DIR = "ui/src/assets/figma_components"

headers = {
    "X-Figma-Token": FIGMA_TOKEN
}

def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_drawable_node_ids(node):
    drawable_types = {"VECTOR", "FRAME", "COMPONENT", "RECTANGLE", "ELLIPSE", "LINE", "POLYGON", "STAR", "TEXT", "INSTANCE", "BOOLEAN_OPERATION", "COMPONENT_SET"}
    node_ids = []
    if node.get("type") in drawable_types:
        node_ids.append(node["id"])
    for child in node.get("children", []):
        node_ids.extend(extract_drawable_node_ids(child))
    return node_ids

def extract_all_node_ids(json_path):
    with open(json_path, 'r') as f:
        data = json.load(f)
    return extract_drawable_node_ids(data["document"])

def get_image_urls(file_key, node_ids):
    ids_param = ",".join(node_ids)
    url = f"https://api.figma.com/v1/images/{file_key}?ids={ids_param}&format=svg"
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json().get('images', {})

def download_svgs(images):
    ensure_output_dir()
    for node_id, url in images.items():
        if not url:
            print(f"Skipping {node_id}: No image URL returned.")
            continue
        svg_data = requests.get(url).content
        out_path = os.path.join(OUTPUT_DIR, f"{node_id}.svg")
        with open(out_path, "wb") as f:
            f.write(svg_data)
        print(f"Downloaded {out_path}")

def main():
    node_ids = extract_all_node_ids(JSON_FILE)
    if not node_ids:
        print("No drawable node IDs found.")
        return
    print(f"Found {len(node_ids)} drawable node IDs.")
    # Figma API has a limit on the number of node IDs per request (max 100)
    batch_size = 90
    for i in range(0, len(node_ids), batch_size):
        batch = node_ids[i:i+batch_size]
        images = get_image_urls(FILE_KEY, batch)
        if not images:
            print("No images found for batch.")
            continue
        download_svgs(images)

if __name__ == "__main__":
    main() 