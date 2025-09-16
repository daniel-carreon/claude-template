
import replicate
import os
import sys

API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")
MODEL_OWNER = "daniel-carreon"
MODEL_NAME = "danielcarreong"

def get_latest_model_version():
    if not API_TOKEN:
        print("Error: REPLICATE_API_TOKEN no está configurada.")
        sys.exit(1)

    try:
        model = replicate.models.get(f"{MODEL_OWNER}/{MODEL_NAME}")
        latest_version_id = model.latest_version.id
        print(latest_version_id)
    except Exception as e:
        print(f"Error al obtener la versión del modelo: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    get_latest_model_version()
