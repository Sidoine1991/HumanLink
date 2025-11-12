"""Service d'envoi d'emails pour la vérification de compte."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from .config import settings


def send_verification_email(email: str, verification_code: str) -> bool:
    """
    Envoie un email avec le code de vérification.
    
    Args:
        email: Adresse email du destinataire
        verification_code: Code de vérification à 6 chiffres
        
    Returns:
        True si l'email a été envoyé avec succès, False sinon
    """
    if not settings.email_user or not settings.email_pass:
        print("Warning: Email credentials not configured. Cannot send verification email.")
        return False
    
    try:
        # Créer le message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Vérification de votre compte HumanLink"
        msg["From"] = settings.email_user
        msg["To"] = email
        
        # Corps du message en texte brut
        text = f"""Bonjour,

Merci de vous être inscrit sur HumanLink!

Votre code de vérification est : {verification_code}

Ce code est valide pendant {settings.verification_code_expire_minutes} minutes.

Si vous n'avez pas créé de compte, veuillez ignorer cet email.

Cordialement,
L'équipe HumanLink
"""
        
        # Corps du message en HTML
        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .code {{
            background-color: #f4f4f4;
            border: 2px dashed #333;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur HumanLink!</h1>
        <p>Bonjour,</p>
        <p>Merci de vous être inscrit sur HumanLink!</p>
        <p>Votre code de vérification est :</p>
        <div class="code">{verification_code}</div>
        <p>Ce code est valide pendant <strong>{settings.verification_code_expire_minutes} minutes</strong>.</p>
        <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
        <div class="footer">
            <p>Cordialement,<br>L'équipe HumanLink</p>
        </div>
    </div>
</body>
</html>
"""
        
        # Attacher les deux versions
        part1 = MIMEText(text, "plain", "utf-8")
        part2 = MIMEText(html, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)
        
        # Envoyer l'email via SMTP
        with smtplib.SMTP(settings.email_host, settings.email_port) as server:
            server.starttls()
            server.login(settings.email_user, settings.email_pass)
            server.send_message(msg)
        
        print(f"Verification email sent to {email}")
        return True
        
    except Exception as e:
        print(f"Error sending verification email to {email}: {e}")
        return False

