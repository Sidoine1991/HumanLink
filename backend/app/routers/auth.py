import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token, get_current_user
from ..config import settings
from ..email_service import send_verification_email


router = APIRouter(prefix="/auth", tags=["auth"])


def generate_verification_code() -> str:
    """Génère un code de vérification à 6 chiffres."""
    return f"{random.randint(100000, 999999)}"


@router.post("/register", response_model=schemas.UserPublic)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"📝 Tentative d'inscription pour: {user_in.email}")
        
        # Essayer de vérifier si l'email existe déjà avec retry
        # Si la connexion échoue, on continue quand même (l'utilisateur pourra être créé)
        existing = None
        try:
            existing = db.query(models.User).filter(models.User.email == user_in.email).first()
        except Exception as db_error:
            error_str = str(db_error).lower()
            if "timeout" in error_str or "connection" in error_str:
                print(f"⚠️ Warning: Impossible de vérifier si l'email existe (timeout). On continue quand même...")
                # Ne pas bloquer l'inscription si on ne peut pas vérifier
                # L'erreur sera levée plus tard lors de l'insertion si l'email existe vraiment
            else:
                raise  # Re-raise si c'est une autre erreur
        
        if existing:
            print(f"❌ Email déjà enregistré: {user_in.email}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
        # Générer le code de vérification
        verification_code = generate_verification_code()
        verification_code_expires = datetime.utcnow() + timedelta(minutes=settings.verification_code_expire_minutes)
        print(f"🔐 Code de vérification généré: {verification_code}")
        
        # Créer l'utilisateur
        user = models.User(
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            display_name=user_in.display_name,
            bio=user_in.bio,
            email_verified="false",
            verification_code=verification_code,
            verification_code_expires=verification_code_expires,
        )
        print(f"👤 Création de l'utilisateur en base de données...")
        try:
            print(f"   📝 Ajout de l'utilisateur à la session...")
            db.add(user)
            print(f"   💾 Commit de la transaction...")
            db.commit()
            print(f"   🔄 Refresh de l'utilisateur...")
            db.refresh(user)
            print(f"✅ Utilisateur créé avec succès: ID={user.id}, Email={user.email}")
        except Exception as commit_error:
            db.rollback()
            error_str = str(commit_error).lower()
            error_type = type(commit_error).__name__
            print(f"❌ Erreur lors du commit: {error_type}: {commit_error}")
            import traceback
            traceback.print_exc()
            
            # Détecter le type d'erreur et fournir un message approprié
            if "timeout" in error_str or "timed out" in error_str:
                error_detail = (
                    "⏱️ Timeout de connexion à Supabase.\n\n"
                    "💡 Solutions possibles:\n"
                    "1. Vérifiez votre connexion internet\n"
                    "2. Vérifiez que votre projet Supabase est actif (pas en pause)\n"
                    "3. Vérifiez que votre IP est autorisée (Supabase > Settings > Database)\n"
                    "4. Exécutez le diagnostic: python diagnostic_supabase.py\n"
                    "5. Vérifiez que les tables existent (voir VERIFIER_TABLES.md)"
                )
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=error_detail
                )
            elif "connection" in error_str or "operationalerror" in error_str or "could not connect" in error_str:
                error_detail = (
                    "🔌 Impossible de se connecter à Supabase.\n\n"
                    "💡 Solutions possibles:\n"
                    "1. Vérifiez votre DATABASE_URL dans le fichier .env\n"
                    "2. Vérifiez que votre projet Supabase est actif\n"
                    "3. Exécutez le diagnostic: python diagnostic_supabase.py\n"
                    "4. Vérifiez que les tables existent (voir VERIFIER_TABLES.md)"
                )
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=error_detail
                )
            elif "does not exist" in error_str or "relation" in error_str and "does not exist" in error_str:
                error_detail = (
                    "📊 Les tables n'existent pas dans Supabase.\n\n"
                    "💡 Solution:\n"
                    "1. Ouvrez Supabase Dashboard > SQL Editor\n"
                    "2. Ouvrez le fichier backend/database/schema.sql\n"
                    "3. Copiez tout le contenu et collez-le dans l'éditeur SQL\n"
                    "4. Cliquez sur 'Run' (ou Ctrl+Enter)\n\n"
                    "Alternative: python init_supabase_tables.py\n"
                    "Voir VERIFIER_TABLES.md pour plus d'informations."
                )
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=error_detail
                )
            raise  # Re-raise si c'est une autre erreur
        
        # Envoyer l'email de vérification
        print(f"📧 Envoi de l'email de vérification à {user_in.email}...")
        email_sent = send_verification_email(user_in.email, verification_code)
        if not email_sent:
            # Si l'email n'a pas pu être envoyé, on continue quand même
            # L'utilisateur pourra demander un nouveau code plus tard
            print(f"⚠️ ATTENTION: L'email de vérification n'a pas pu être envoyé à {user_in.email}")
            print(f"   Le code de vérification est: {verification_code}")
            print(f"   L'utilisateur peut utiliser ce code pour vérifier son compte")
            print(f"   OU demander un nouveau code via /auth/resend-verification")
        else:
            print(f"✅ Email de vérification envoyé avec succès à {user_in.email}")
        
        # Convertir email_verified de string à bool pour la réponse
        return schemas.UserPublic(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            bio=user.bio,
            email_verified=user.email_verified == "true" if isinstance(user.email_verified, str) else bool(user.email_verified),
        )
    except HTTPException:
        # Re-raise les HTTPException telles quelles
        raise
    except UnicodeDecodeError as e:
        print(f"❌ Erreur d'encodage lors de l'inscription: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur de connexion à la base de données. Vérifiez la configuration DATABASE_URL dans le fichier .env. Voir FIX_DATABASE_CONNECTION.md pour plus d'informations."
        )
    except Exception as e:
        print(f"❌ Erreur lors de l'inscription: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        # Vérifier si c'est une erreur de connexion à la base de données
        error_str = str(e).lower()
        if "timeout" in error_str or "timed out" in error_str:
            error_detail = (
                "⏱️ Timeout de connexion à Supabase.\n\n"
                "💡 Solutions possibles:\n"
                "1. Vérifiez votre connexion internet\n"
                "2. Vérifiez que votre projet Supabase est actif (pas en pause)\n"
                "3. Exécutez le diagnostic: python diagnostic_supabase.py\n"
                "4. Vérifiez que les tables existent (voir VERIFIER_TABLES.md)"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=error_detail
            )
        elif "connection" in error_str or "database" in error_str or "psycopg2" in error_str:
            error_detail = (
                "🔌 Erreur de connexion à Supabase.\n\n"
                "💡 Solutions possibles:\n"
                "1. Vérifiez votre DATABASE_URL dans le fichier .env\n"
                "2. Exécutez le diagnostic: python diagnostic_supabase.py\n"
                "3. Vérifiez que les tables existent (voir VERIFIER_TABLES.md)"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=error_detail
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création du compte: {str(e)}"
        )


@router.post("/verify-email", response_model=schemas.VerifyEmailResponse)
def verify_email(verification: schemas.EmailVerification, db: Session = Depends(get_db)):
    """Vérifie le code de vérification email."""
    print(f"🔍 Tentative de vérification pour l'email: {verification.email}")
    print(f"🔍 Code fourni: {verification.code} (type: {type(verification.code)})")
    
    user = db.query(models.User).filter(models.User.email == verification.email).first()
    if not user:
        print(f"❌ Utilisateur non trouvé pour l'email: {verification.email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    print(f"✅ Utilisateur trouvé: ID={user.id}, Email={user.email}")
    print(f"   email_verified: {user.email_verified}")
    print(f"   verification_code en DB: {user.verification_code} (type: {type(user.verification_code)})")
    print(f"   verification_code_expires: {user.verification_code_expires}")
    
    if user.email_verified == "true":
        print(f"❌ Email déjà vérifié")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified")
    
    if not user.verification_code:
        print(f"❌ Aucun code de vérification trouvé en base de données")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No verification code found. Please register again.")
    
    # Vérifier l'expiration
    if user.verification_code_expires:
        now = datetime.utcnow()
        expires = user.verification_code_expires
        print(f"⏰ Vérification de l'expiration: maintenant={now}, expiration={expires}")
        if expires < now:
            print(f"❌ Code expiré (expiré depuis {now - expires})")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired. Please request a new one.")
    else:
        print(f"⚠️ Aucune date d'expiration définie pour le code")
    
    # Comparer les codes (en s'assurant qu'ils sont des strings et en supprimant les espaces)
    code_from_db = str(user.verification_code).strip()
    code_from_request = str(verification.code).strip()
    
    print(f"🔍 Comparaison des codes:")
    print(f"   Code en DB (après nettoyage): '{code_from_db}' (longueur: {len(code_from_db)})")
    print(f"   Code fourni (après nettoyage): '{code_from_request}' (longueur: {len(code_from_request)})")
    print(f"   Codes identiques: {code_from_db == code_from_request}")
    
    if code_from_db != code_from_request:
        print(f"❌ Code invalide - les codes ne correspondent pas")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code")
    
    print(f"✅ Code valide - vérification de l'email...")
    
    # Vérifier l'email
    user.email_verified = "true"
    user.verification_code = None
    user.verification_code_expires = None
    db.commit()
    db.refresh(user)
    
    print(f"✅ Email vérifié avec succès pour {user.email}")
    
    return schemas.VerifyEmailResponse(verified=True, message="Email verified successfully")


@router.post("/resend-verification", response_model=schemas.ResendVerificationResponse)
def resend_verification(email_data: schemas.ResendVerificationRequest, db: Session = Depends(get_db)):
    """Renvoye le code de vérification."""
    print(f"📧 Demande de renvoi de code de vérification pour: {email_data.email}")
    
    user = db.query(models.User).filter(models.User.email == email_data.email).first()
    if not user:
        print(f"❌ Utilisateur non trouvé pour l'email: {email_data.email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.email_verified == "true":
        print(f"❌ Email déjà vérifié pour: {email_data.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified")
    
    # Générer un nouveau code
    verification_code = generate_verification_code()
    verification_code_expires = datetime.utcnow() + timedelta(minutes=settings.verification_code_expire_minutes)
    
    print(f"🔐 Nouveau code de vérification généré: {verification_code}")
    print(f"   Expiration: {verification_code_expires}")
    
    user.verification_code = verification_code
    user.verification_code_expires = verification_code_expires
    db.commit()
    db.refresh(user)
    
    print(f"✅ Code sauvegardé en base de données")
    
    # Envoyer l'email
    print(f"📧 Envoi de l'email de vérification à {email_data.email}...")
    email_sent = send_verification_email(email_data.email, verification_code)
    if not email_sent:
        print(f"❌ Échec de l'envoi de l'email, mais le code est sauvegardé: {verification_code}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not send verification email. Please check your email configuration or try again later."
        )
    
    print(f"✅ Code de vérification renvoyé avec succès à {email_data.email}")
    
    return schemas.ResendVerificationResponse(sent=True, message="Verification code sent successfully")


@router.get("/me", response_model=schemas.UserPublic)
def get_current_user_info(user: models.User = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur connecté."""
    # Convertir email_verified de string à bool pour la réponse
    return schemas.UserPublic(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        bio=user.bio,
        email_verified=user.email_verified == "true" if isinstance(user.email_verified, str) else bool(user.email_verified),
    )


@router.put("/me", response_model=schemas.UserPublic)
def update_current_user_info(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Met à jour les informations de profil de l'utilisateur connecté."""
    has_changes = False

    if user_update.display_name is not None:
        cleaned_display_name = user_update.display_name.strip() or None
        if cleaned_display_name != user.display_name:
            user.display_name = cleaned_display_name
            has_changes = True

    if user_update.bio is not None:
        cleaned_bio = user_update.bio.strip() or None
        if cleaned_bio != user.bio:
            user.bio = cleaned_bio
            has_changes = True

    if has_changes:
        db.add(user)
        db.commit()
        db.refresh(user)

    return schemas.UserPublic(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        bio=user.bio,
        email_verified=user.email_verified == "true" if isinstance(user.email_verified, str) else bool(user.email_verified),
    )


@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    # Vérifier que l'email est vérifié
    if user.email_verified != "true":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your email for the verification code."
        )
    
    token = create_access_token(user_id=user.id)
    return schemas.Token(access_token=token)


