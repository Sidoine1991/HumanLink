from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth as auth_router
from .routers import mood as mood_router
from .routers import match as match_router
from .routers import feedback as feedback_router
from .routers import places as places_router
from .routers import chat as chat_router
from .routers import notifications as notifications_router
from .routers import feed as feed_router
from .routers import design as design_router
from .db import Base, engine
from .models import User, MoodEvent, Feedback, Conversation, Message, Notification


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, debug=settings.debug)
    
    # Vérifier que nous utilisons Supabase
    if settings.database_url.startswith("postgresql"):
        print("✅ Connexion à Supabase PostgreSQL configurée")
    else:
        print(f"⚠️  ATTENTION: Base de données non-Supabase détectée: {settings.database_url[:50]}...")
    
    # Créer les tables au démarrage si elles n'existent pas
    # Note: Ne pas faire planter le serveur si la connexion échoue (problème réseau temporaire)
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables Supabase vérifiées/créées avec succès")
    except Exception as e:
        error_msg = str(e)
        if "Connection timed out" in error_msg or "timeout" in error_msg.lower():
            print(f"⚠️  AVERTISSEMENT: Connexion à Supabase échouée (timeout)")
            print("   Le serveur démarre quand même, mais les tables doivent être créées manuellement.")
            print("   💡 Solutions:")
            print("      1. Créez les tables via Supabase Dashboard > SQL Editor (copiez database/schema.sql)")
            print("      2. Vérifiez votre connexion internet et réessayez: python init_supabase_tables.py")
            print("      3. Vérifiez que votre projet Supabase est actif (pas en pause)")
        else:
            print(f"⚠️  AVERTISSEMENT: Impossible de créer les tables dans Supabase: {e}")
            print("   💡 Exécutez: python init_supabase_tables.py pour initialiser les tables")
            print("   💡 Ou créez les tables manuellement via Supabase Dashboard > SQL Editor")
        # Ne pas faire planter le serveur - l'utilisateur peut créer les tables manuellement

    # Configuration CORS pour permettre les requêtes depuis l'application web Expo
    # Note: On ne peut pas utiliser "*" avec allow_credentials=True, donc on liste explicitement les origines
    allowed_origins = [
        "http://localhost:8083",      # Expo web dev server (port par défaut)
        "http://localhost:19006",     # Expo web alternative port
        "http://127.0.0.1:8083",
        "http://127.0.0.1:19006",
        "http://localhost:3000",      # React dev server / webpack-dev-server
        "http://127.0.0.1:3000",      # React dev server (127.0.0.1)
        "http://localhost:5173",      # Vite dev server (si utilisé)
        "http://127.0.0.1:5173",      # Vite dev server (127.0.0.1)
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"status": "ok"}

    app.include_router(auth_router.router)
    app.include_router(mood_router.router)
    app.include_router(match_router.router)
    app.include_router(feedback_router.router)
    app.include_router(places_router.router)
    app.include_router(chat_router.router)
    app.include_router(notifications_router.router)
    app.include_router(feed_router.router)
    app.include_router(design_router.router)
    return app


app = create_app()


@app.get("/", tags=["meta"])
def root():
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
    }


