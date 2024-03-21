import json
import sys

def read_json(filename):
    try:
        with open(filename, 'r', encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("File not found")
        sys.exit(1)
    except Exception as e:
        print(e)
        sys.exit(1)
    return data

def rewrite_json(data):
    new_data = {}
    new_data["compositores"] = data["compositores"]
    periodos = []
    for compositor in new_data["compositores"]:
        if "periodo" in compositor and compositor["periodo"] not in periodos:
            periodos.append(compositor["periodo"])
    new_data["periodos"] = [{"periodo": periodo} for periodo in periodos]
    return new_data

def main():
    filename = "compositores.json"
    data = read_json(filename)
    new_data = rewrite_json(data)
    with open("newcompositores.json", 'w', encoding="utf-8") as f:
        json.dump(new_data, f, indent=4)

if __name__ == "__main__":
    main()