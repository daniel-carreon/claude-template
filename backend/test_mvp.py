#!/usr/bin/env python3
"""
🚀 MVP Testing Script
Verifica que toda la funcionalidad del MVP esté funcionando correctamente
"""

import asyncio
import aiohttp
import json
from datetime import datetime
import sys
import os

# URLs de testing
FRONTEND_URL = "http://localhost:3003"
BACKEND_URL = "http://localhost:8000"

class MVPTester:
    def __init__(self):
        """Inicializa el tester del MVP"""
        self.tests_passed = 0
        self.tests_failed = 0
        self.test_results = []

    async def log_test(self, test_name: str, success: bool, details: str = ""):
        """Registra el resultado de un test"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")

        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

        if success:
            self.tests_passed += 1
        else:
            self.tests_failed += 1

    async def test_frontend_accessibility(self):
        """Verifica que el frontend sea accesible"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(FRONTEND_URL, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        if "Daniel Flux Context" in content:
                            await self.log_test("Frontend Accessibility", True, f"Status: {response.status}")
                        else:
                            await self.log_test("Frontend Accessibility", False, "Missing expected content")
                    else:
                        await self.log_test("Frontend Accessibility", False, f"Status: {response.status}")
        except Exception as e:
            await self.log_test("Frontend Accessibility", False, f"Error: {str(e)}")

    async def test_backend_health(self):
        """Verifica que el backend esté funcionando"""
        try:
            async with aiohttp.ClientSession() as session:
                # Test health endpoint
                health_url = f"{BACKEND_URL}/health"
                async with session.get(health_url, timeout=5) as response:
                    if response.status == 200:
                        await self.log_test("Backend Health", True, f"Status: {response.status}")
                    else:
                        await self.log_test("Backend Health", False, f"Status: {response.status}")
        except Exception as e:
            await self.log_test("Backend Health", False, f"Error: {str(e)}")

    async def test_api_endpoints(self):
        """Verifica endpoints principales de la API"""
        endpoints = [
            "/api/generate",
            "/api/favorites"
        ]

        for endpoint in endpoints:
            try:
                async with aiohttp.ClientSession() as session:
                    url = f"{FRONTEND_URL}{endpoint}"
                    async with session.get(url, timeout=5) as response:
                        # Para endpoints POST, GET debería retornar 405 (Method Not Allowed)
                        if response.status in [200, 405]:
                            await self.log_test(f"API Endpoint {endpoint}", True, f"Status: {response.status}")
                        else:
                            await self.log_test(f"API Endpoint {endpoint}", False, f"Status: {response.status}")
            except Exception as e:
                await self.log_test(f"API Endpoint {endpoint}", False, f"Error: {str(e)}")

    async def test_dark_ui_components(self):
        """Verifica que los componentes de UI oscura estén cargando"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(FRONTEND_URL, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()

                        # Verificar elementos clave del tema oscuro
                        checks = [
                            ("GlassCard components", "glass-card" in content.lower() or "backdrop-blur" in content),
                            ("Purple theme", "purple" in content.lower()),
                            ("Dark theme", "dark" in content.lower() or "bg-slate-900" in content),
                            ("Generate button", "generate" in content.lower()),
                            ("Image grid", "image-grid" in content.lower())
                        ]

                        for check_name, condition in checks:
                            await self.log_test(f"UI Component: {check_name}", condition)
                    else:
                        await self.log_test("Dark UI Components", False, f"Cannot access frontend: {response.status}")
        except Exception as e:
            await self.log_test("Dark UI Components", False, f"Error: {str(e)}")

    async def test_file_system_structure(self):
        """Verifica que la estructura de archivos esté correcta"""
        critical_files = [
            "frontend/src/app/page.tsx",
            "frontend/src/app/layout.tsx",
            "frontend/src/app/globals.css",
            "frontend/src/components/ui/glass-card.tsx",
            "frontend/src/components/ui/liquid-glass-button.tsx",
            "backend/storage/compressed_images",
            "backend/train_flux_kontext.py",
            "backend/supabase_optimizer.py"
        ]

        for file_path in critical_files:
            full_path = os.path.join("/Users/danielcarreon/Documents/AI/daniel-flux-context", file_path)
            exists = os.path.exists(full_path)
            await self.log_test(f"File Structure: {file_path}", exists)

    async def test_compressed_images(self):
        """Verifica que las imágenes comprimidas estén disponibles"""
        compressed_dir = "/Users/danielcarreon/Documents/AI/daniel-flux-context/backend/storage/compressed_images"

        if os.path.exists(compressed_dir):
            files = [f for f in os.listdir(compressed_dir) if f.lower().endswith(('.jpg', '.jpeg'))]
            count = len(files)

            if count >= 60:  # Esperamos al menos 60 de las 65 imágenes
                await self.log_test("Compressed Images", True, f"Found {count} compressed images")
            else:
                await self.log_test("Compressed Images", False, f"Only {count} images found, expected 60+")
        else:
            await self.log_test("Compressed Images", False, "Compressed images directory not found")

    async def generate_report(self):
        """Genera un reporte completo del MVP"""
        total_tests = self.tests_passed + self.tests_failed
        success_rate = (self.tests_passed / total_tests * 100) if total_tests > 0 else 0

        report = f"""
🚀 MVP Testing Report
=====================
📊 Test Results:
   ✅ Passed: {self.tests_passed}
   ❌ Failed: {self.tests_failed}
   📈 Success Rate: {success_rate:.1f}%

🎯 MVP Status: {"🟢 READY" if success_rate >= 80 else "🟡 NEEDS WORK" if success_rate >= 60 else "🔴 NOT READY"}

⏰ Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        print(report)

        # Guardar reporte detallado
        detailed_report = {
            "summary": {
                "tests_passed": self.tests_passed,
                "tests_failed": self.tests_failed,
                "success_rate": success_rate,
                "mvp_status": "READY" if success_rate >= 80 else "NEEDS_WORK" if success_rate >= 60 else "NOT_READY"
            },
            "detailed_results": self.test_results,
            "generated_at": datetime.now().isoformat()
        }

        with open("mvp_test_report.json", "w") as f:
            json.dump(detailed_report, f, indent=2)

        print("📄 Detailed report saved to: mvp_test_report.json")

async def main():
    """Función principal de testing"""
    tester = MVPTester()

    print("🚀 Iniciando tests del MVP...")
    print("=" * 40)

    # Ejecutar todos los tests
    await tester.test_frontend_accessibility()
    await tester.test_backend_health()
    await tester.test_api_endpoints()
    await tester.test_dark_ui_components()
    await tester.test_file_system_structure()
    await tester.test_compressed_images()

    # Generar reporte final
    await tester.generate_report()

if __name__ == "__main__":
    asyncio.run(main())