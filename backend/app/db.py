from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings
import urllib.parse
import sys
import socket
import io

# Configurer l'encodage UTF-8 pour Windows
if sys.platform == 'win32':
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'buffer'):
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


class Base(DeclarativeBase):
    pass


# Gérer l'encodage de l'URL de la base de données
def get_engine():
    """Crée l'engine SQLAlchemy avec gestion d'encodage."""
    database_url = settings.database_url
    
    # S'assurer que l'URL est une chaîne UTF-8 valide
    if isinstance(database_url, bytes):
        try:
            database_url = database_url.decode('utf-8')
        except UnicodeDecodeError:
            # Si UTF-8 échoue, essayer latin-1 (qui peut décoder n'importe quel byte)
            database_url = database_url.decode('latin-1')
    
    # Préparer les arguments de connexion
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    elif database_url.startswith("postgresql"):
        # Pour PostgreSQL, essayer de parser l'URL et reconstruire proprement
        try:
            parsed = urllib.parse.urlparse(database_url)
            hostname = parsed.hostname
            
            # Essayer de résoudre le hostname en IPv4 pour éviter les problèmes IPv6
            try:
                # Résoudre uniquement en IPv4 (AF_INET)
                ipv4_address = socket.gethostbyname(hostname)
                print(f"✅ Résolution DNS IPv4: {hostname} -> {ipv4_address}")
                # Remplacer le hostname par l'IP IPv4 dans l'URL
                hostname = ipv4_address
            except socket.gaierror as dns_error:
                print(f"⚠️ Warning: Impossible de résoudre {hostname} en IPv4: {dns_error}")
                print("   Utilisation du hostname original (peut causer des timeouts IPv6)")
            
            # Décoder le mot de passe si nécessaire
            password = urllib.parse.unquote(parsed.password) if parsed.password else None
            
            # Nettoyer les paramètres de requête - retirer pgbouncer qui n'est pas supporté par psycopg2
            query_params = urllib.parse.parse_qs(parsed.query)
            # Retirer pgbouncer des paramètres
            if 'pgbouncer' in query_params:
                del query_params['pgbouncer']
            # Reconstruire la query string sans pgbouncer
            clean_query = urllib.parse.urlencode(query_params, doseq=True)
            
            # Reconstruire l'URL avec le mot de passe correctement encodé et l'IP IPv4
            if password:
                # Ré-encoder le mot de passe pour s'assurer qu'il est correct
                encoded_password = urllib.parse.quote(password, safe='')
                # Reconstruire l'URL avec l'IP IPv4
                netloc = f"{parsed.username}:{encoded_password}@{hostname}"
                if parsed.port:
                    netloc += f":{parsed.port}"
                database_url = urllib.parse.urlunparse((
                    parsed.scheme,
                    netloc,
                    parsed.path,
                    parsed.params,
                    clean_query,  # Utiliser la query nettoyée (sans pgbouncer)
                    parsed.fragment
                ))
            else:
                # Pas de mot de passe, mais on doit quand même remplacer le hostname
                netloc = f"{parsed.username}@{hostname}"
                if parsed.port:
                    netloc += f":{parsed.port}"
                database_url = urllib.parse.urlunparse((
                    parsed.scheme,
                    netloc,
                    parsed.path,
                    parsed.params,
                    clean_query,  # Utiliser la query nettoyée (sans pgbouncer)
                    parsed.fragment
                ))
            # Forcer IPv4 si nécessaire (résout les problèmes de timeout IPv6)
            # Ajouter connect_timeout pour éviter les timeouts trop longs
            # Timeout augmenté à 15 secondes pour les connexions lentes
            connect_args = {
                "client_encoding": "UTF8",
                "connect_timeout": 15,  # Timeout de 15 secondes (augmenté pour connexions lentes)
                "keepalives": 1,  # Activer les keepalives TCP
                "keepalives_idle": 30,  # Temps avant le premier keepalive
                "keepalives_interval": 10,  # Intervalle entre les keepalives
                "keepalives_count": 3,  # Nombre de keepalives avant déconnexion
            }
        except Exception as e:
            print(f"⚠️ Warning: Could not parse database URL, using as-is: {e}")
            connect_args = {
                "client_encoding": "UTF8",
                "connect_timeout": 15,  # Timeout de 15 secondes (augmenté pour connexions lentes)
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 3,
            }
    else:
        connect_args = {}
    
    try:
        # Essayer de créer l'engine avec l'URL nettoyée
        # Configuration du pool pour gérer les timeouts et les reconnexions
        # Note: poolclass=NullPool désactive le pool pour éviter les problèmes de connexion persistante
        from sqlalchemy.pool import NullPool
        engine = create_engine(
            database_url,
            connect_args=connect_args,
            poolclass=NullPool,  # Pas de pool pour éviter les problèmes de connexion persistante
            pool_pre_ping=False,  # Désactivé car on n'utilise pas de pool
            echo=False,  # Désactiver les logs SQL en production
        )
        # Tester la connexion immédiatement pour détecter les erreurs
        # Note: Ne pas faire planter si la connexion échoue (problème réseau temporaire)
        try:
            from sqlalchemy import text
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception as conn_error:
            error_msg = str(conn_error)
            error_lower = error_msg.lower()
            # Ne pas afficher l'erreur complète si c'est juste un timeout (trop verbeux)
            if "Connection timed out" in error_msg or "timeout" in error_lower:
                print(f"⚠️ Warning: Test de connexion à Supabase échoué (timeout)")
                print("   Le serveur peut démarrer, mais les tables doivent être créées manuellement.")
                print("   💡 Exécutez: python diagnostic_supabase.py pour diagnostiquer le problème")
            elif "does not exist" in error_lower or "relation" in error_lower:
                print(f"⚠️ Warning: Les tables n'existent peut-être pas dans Supabase")
                print("   💡 Créez les tables via Supabase Dashboard > SQL Editor (voir VERIFIER_TABLES.md)")
            else:
                print(f"⚠️ Warning: Test de connexion échoué: {conn_error}")
                print("   💡 Exécutez: python diagnostic_supabase.py pour diagnostiquer le problème")
            # Ne pas lever l'erreur ici, laisser SQLAlchemy gérer les reconnexions
        return engine
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'engine de base de données: {e}")
        print(f"📝 Database URL (premiers 50 caractères): {database_url[:50]}...")
        import traceback
        traceback.print_exc()
        raise


engine = get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


