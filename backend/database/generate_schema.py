"""
Script pour générer automatiquement le schéma SQL à partir des modèles SQLAlchemy.

Usage:
    python database/generate_schema.py
    
Cela génère un fichier schema_auto.sql avec le schéma complet.
"""
import sys
from pathlib import Path

# Ajouter le répertoire parent au path pour importer les modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.schema import CreateTable
from app.db import engine, Base
from app.models import User, MoodEvent, Feedback


def generate_schema():
    """Génère le schéma SQL à partir des modèles SQLAlchemy."""
    
    output = []
    output.append("-- =====================================================")
    output.append("-- HumanLink Database Schema (Auto-generated)")
    output.append("-- PostgreSQL / Supabase")
    output.append("-- =====================================================")
    output.append("--")
    output.append("-- Ce fichier a été généré automatiquement à partir des modèles SQLAlchemy")
    output.append("-- Ne modifiez pas ce fichier manuellement!")
    output.append("-- Utilisez: python database/generate_schema.py")
    output.append("-- =====================================================\n")
    
    # Générer les tables
    output.append("-- Table: users")
    output.append(str(CreateTable(User.__table__).compile(engine)))
    output.append(";\n")
    
    output.append("-- Table: mood_events")
    output.append(str(CreateTable(MoodEvent.__table__).compile(engine)))
    output.append(";\n")
    
    output.append("-- Table: feedbacks")
    output.append(str(CreateTable(Feedback.__table__).compile(engine)))
    output.append(";\n")
    
    # Ajouter les index supplémentaires (non générés automatiquement par SQLAlchemy)
    output.append("-- Index supplémentaires pour optimiser les performances")
    output.append("CREATE INDEX IF NOT EXISTS idx_mood_events_created_at ON mood_events(created_at DESC);")
    output.append("CREATE INDEX IF NOT EXISTS idx_mood_events_location ON mood_events(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;")
    output.append("CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);")
    output.append("")
    
    return "\n".join(output)


if __name__ == "__main__":
    schema_sql = generate_schema()
    
    output_file = Path(__file__).parent / "schema_auto.sql"
    output_file.write_text(schema_sql, encoding="utf-8")
    
    print(f"✓ Schéma généré avec succès: {output_file}")
    print(f"  {len(schema_sql.split(chr(10)))} lignes générées")

