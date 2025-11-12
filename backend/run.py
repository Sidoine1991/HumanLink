#!/usr/bin/env python3
"""
Script pour démarrer le serveur FastAPI HumanLink
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Démarrage du serveur HumanLink API...")
    print("📡 Serveur disponible sur: http://localhost:8000")
    print("📚 Documentation API: http://localhost:8000/docs")
    print("💚 Health check: http://localhost:8000/health")
    print("\n⚠️  Appuyez sur Ctrl+C pour arrêter le serveur\n")
    
    # Utiliser une chaîne d'import pour activer le mode reload
    uvicorn.run(
        "app.main:app",  # Chaîne d'import au lieu de l'objet direct
        host="0.0.0.0",
        port=8000,
        reload=True,  # Rechargement automatique en développement
        log_level="info"
    )

