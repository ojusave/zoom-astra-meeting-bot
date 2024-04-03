from sentence_transformers import SentenceTransformer
import sys
import json

model = SentenceTransformer('all-MiniLM-L6-v2')

def vectorize(text):
    return model.encode([text]).tolist()

if __name__ == "__main__":
    input_text = sys.argv[1]
    vector = vectorize(input_text)
    print(json.dumps(vector))
