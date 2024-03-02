import json

def read_json(filename):
    try:
        with open(filename, 'r', encoding="utf-8") as f:
            data = f.readlines()
            result = [json.loads(line) for line in data]
    except FileNotFoundError:
        print(f"O ficheiro '{filename}' não existe!")
    except Exception as e:
        print(f"Ocorreu um erro: '{e}'")
    return result

def calc_data(data):
    filmes = []
    atores = []
    generos = []
    for elem in data:
        filme = {
            "_id": elem["_id"]["$oid"],
            "title": elem["title"],
            "year": elem["year"],
            "genres": elem.get("genres", []),
            "cast": elem.get("cast", [])
        }
        filmes.append(filme)
        for actor in elem.get("cast", []):
            if actor not in atores:
                atores.append(actor)
        for genre in elem.get("genres", []):
            if genre not in generos:
                generos.append(genre)
    generos2 = [{"name": genre} for genre in generos]
    atores2 = [{"name": actor} for actor in atores]
    return {"filmes": filmes, "atores": atores2, "generos": generos2}

def main():
    filename = "filmes.json"
    data = read_json(filename)
    result = calc_data(data)
    with open("newfilmes.json", 'w', encoding="utf-8") as f:
        json.dump(result, f, indent=4)

if __name__ == "__main__":
    main()