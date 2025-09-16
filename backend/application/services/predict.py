
import replicate
import os
import sys

# --- Parámetros de Predicción ---
API_TOKEN = os.environ.get("REPLICATE_API_TOKEN")
MODEL_VERSION = "daniel-carreon/daniel-flux-lora:0df303cdaee452247e1c57034d5e558615046eabddaa433b21fdd9ad751d3c78"

# Prompt diseñado para una miniatura de YouTube de alta calidad
PROMPT = "Close-up photo of DANIELC with a surprised and excited expression, perfect for a YouTube thumbnail. Dramatic, vibrant studio lighting. Ultra sharp, 8k resolution, incredibly high detail, professional photography."

def main():
    """
    Función principal para generar una imagen con el modelo fine-tuned.
    """
    if not API_TOKEN:
        print("Error: La variable de entorno REPLICATE_API_TOKEN no está configurada.")
        sys.exit(1)

    print("Enviando la solicitud de predicción a Replicate...")
    print(f"Prompt: {PROMPT}")

    try:
        output = replicate.run(
            MODEL_VERSION,
            input={"prompt": PROMPT}
        )

        print("\n¡Imagen generada con éxito!")
        print("URL de la imagen:")
        # La salida es una lista, imprimimos el primer elemento
        if isinstance(output, list) and len(output) > 0:
            print(output[0])
        else:
            print(output)

    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
