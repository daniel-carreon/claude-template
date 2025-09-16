#!/usr/bin/env python3
"""
🗄️ Supabase Bucket Optimizer
Optimiza la subida de imágenes comprimidas al bucket de Supabase
"""

import os
import asyncio
from pathlib import Path
from supabase import create_client, Client
import mimetypes
from datetime import datetime
import json

# Configuración de Supabase
SUPABASE_URL = "https://vonbztcjvrosbypuhmeo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "your_supabase_service_key_here")
BUCKET_NAME = "generated-images"

class SupabaseOptimizer:
    def __init__(self):
        """Inicializa el optimizador de Supabase"""
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.uploaded_count = 0
        self.failed_count = 0

    async def create_bucket_if_not_exists(self):
        """Crea el bucket si no existe"""
        try:
            # Listar buckets existentes
            buckets = self.supabase.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]

            if BUCKET_NAME not in bucket_names:
                print(f"📦 Creando bucket '{BUCKET_NAME}'...")
                self.supabase.storage.create_bucket(BUCKET_NAME, {"public": True})
                print(f"✅ Bucket '{BUCKET_NAME}' creado exitosamente")
            else:
                print(f"✅ Bucket '{BUCKET_NAME}' ya existe")

        except Exception as e:
            print(f"❌ Error al crear bucket: {e}")

    async def upload_compressed_images(self):
        """Sube las imágenes comprimidas al bucket"""
        compressed_dir = Path("storage/compressed_images")

        if not compressed_dir.exists():
            print(f"❌ Directorio {compressed_dir} no encontrado")
            return

        # Obtener lista de archivos de imagen
        image_files = list(compressed_dir.glob("*.jpg")) + list(compressed_dir.glob("*.jpeg"))
        total_files = len(image_files)

        print(f"🚀 Iniciando subida de {total_files} imágenes comprimidas...")

        for i, image_path in enumerate(image_files, 1):
            try:
                # Leer archivo
                with open(image_path, 'rb') as f:
                    file_data = f.read()

                # Generar nombre único
                file_name = f"compressed_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{image_path.name}"

                # Detectar tipo MIME
                mime_type, _ = mimetypes.guess_type(str(image_path))
                if not mime_type:
                    mime_type = "image/jpeg"

                # Subir archivo
                response = self.supabase.storage.from_(BUCKET_NAME).upload(
                    file_name,
                    file_data,
                    file_options={"content-type": mime_type}
                )

                if response:
                    self.uploaded_count += 1
                    print(f"✅ [{i}/{total_files}] Subido: {file_name}")
                else:
                    self.failed_count += 1
                    print(f"❌ [{i}/{total_files}] Error subiendo: {image_path.name}")

            except Exception as e:
                self.failed_count += 1
                print(f"❌ [{i}/{total_files}] Error con {image_path.name}: {e}")

        print(f"\n📊 Resumen de subida:")
        print(f"✅ Exitosas: {self.uploaded_count}")
        print(f"❌ Fallidas: {self.failed_count}")
        print(f"📁 Total: {total_files}")

    async def optimize_mcp_integration(self):
        """Optimiza la integración MCP con funciones especializadas"""
        print("🔧 Optimizando integración MCP...")

        # Crear funciones SQL para optimizar queries
        optimization_queries = [
            """
            -- Función para obtener imágenes favoritas optimizada
            CREATE OR REPLACE FUNCTION get_user_favorites(user_id_param UUID DEFAULT NULL)
            RETURNS TABLE (
                id UUID,
                original_url TEXT,
                supabase_url TEXT,
                prompt TEXT,
                image_id TEXT,
                saved_at TIMESTAMPTZ
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    f.id,
                    f.original_url,
                    f.supabase_url,
                    f.prompt,
                    f.image_id,
                    f.saved_at
                FROM favorite_images f
                WHERE (user_id_param IS NULL OR f.id = user_id_param)
                ORDER BY f.saved_at DESC
                LIMIT 50;
            END;
            $$ LANGUAGE plpgsql;
            """,

            """
            -- Índice optimizado para búsquedas por prompt
            CREATE INDEX IF NOT EXISTS idx_favorite_images_prompt_gin
            ON favorite_images USING gin(to_tsvector('english', prompt));
            """,

            """
            -- Índice para búsquedas por fecha
            CREATE INDEX IF NOT EXISTS idx_favorite_images_saved_at
            ON favorite_images (saved_at DESC);
            """,

            """
            -- Función para búsqueda de texto en prompts
            CREATE OR REPLACE FUNCTION search_favorites_by_prompt(search_term TEXT)
            RETURNS TABLE (
                id UUID,
                original_url TEXT,
                supabase_url TEXT,
                prompt TEXT,
                image_id TEXT,
                saved_at TIMESTAMPTZ,
                relevance REAL
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    f.id,
                    f.original_url,
                    f.supabase_url,
                    f.prompt,
                    f.image_id,
                    f.saved_at,
                    ts_rank(to_tsvector('english', f.prompt), plainto_tsquery('english', search_term)) as relevance
                FROM favorite_images f
                WHERE to_tsvector('english', f.prompt) @@ plainto_tsquery('english', search_term)
                ORDER BY relevance DESC, f.saved_at DESC
                LIMIT 20;
            END;
            $$ LANGUAGE plpgsql;
            """
        ]

        for query in optimization_queries:
            try:
                self.supabase.rpc('exec_sql', {'query': query})
                print("✅ Query de optimización ejecutada")
            except Exception as e:
                print(f"⚠️ Error en optimización: {e}")

    async def generate_storage_stats(self):
        """Genera estadísticas del storage"""
        try:
            # Listar archivos en el bucket
            files = self.supabase.storage.from_(BUCKET_NAME).list()

            total_files = len(files)
            total_size = sum(f.get('metadata', {}).get('size', 0) for f in files if f.get('metadata'))

            stats = {
                "bucket_name": BUCKET_NAME,
                "total_files": total_files,
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "last_updated": datetime.now().isoformat(),
                "supabase_url": SUPABASE_URL
            }

            # Guardar estadísticas
            with open("storage_stats.json", "w") as f:
                json.dump(stats, f, indent=2)

            print(f"📊 Estadísticas de storage:")
            print(f"   📁 Archivos: {total_files}")
            print(f"   💾 Tamaño: {stats['total_size_mb']} MB")
            print(f"   🌐 URL: {SUPABASE_URL}")

        except Exception as e:
            print(f"❌ Error generando estadísticas: {e}")

async def main():
    """Función principal de optimización"""
    optimizer = SupabaseOptimizer()

    print("🗄️ Iniciando optimización de Supabase...")
    print("=" * 50)

    # Crear bucket si no existe
    await optimizer.create_bucket_if_not_exists()

    # Subir imágenes comprimidas
    await optimizer.upload_compressed_images()

    # Optimizar integración MCP
    await optimizer.optimize_mcp_integration()

    # Generar estadísticas
    await optimizer.generate_storage_stats()

    print("\n🎉 Optimización de Supabase completada!")

if __name__ == "__main__":
    asyncio.run(main())