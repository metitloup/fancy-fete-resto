import json
import pandas as pd
from datetime import datetime

def generer_rapport():
    try:
        # 1. Chargement de la DB
        with open('db.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        historique = data.get('historique', [])
        if not historique:
            print("L'historique est vide.")
            return

        # 2. Préparation des données
        df = pd.DataFrame(historique)
        
        # Conversion du timestamp en date lisible
        df['date_heure'] = pd.to_datetime(df['timestamp'], unit='ms').dt.strftime('%H:%M:%S')
        
        # 3. Création du fichier Excel avec deux onglets
        filename = f"Rapport_Ventes_{datetime.now().strftime('%Y-%m-%d')}.xlsx"
        
        with pd.ExcelWriter(filename) as writer:
            # Onglet 1 : Détail de chaque ligne
            df[['date_heure', 'plat', 'taille', 'cuisson', 'acc', 'qty', 'duree']].to_excel(writer, sheet_name='Detail_Ventes', index=False)
            
            # Onglet 2 : Résumé par Plat
            resume = df.groupby(['plat', 'taille']).agg({'qty': 'sum', 'duree': 'mean'}).reset_index()
            resume.columns = ['Plat', 'Type', 'Quantité Totale', 'Temps Prépa Moyen (sec)']
            resume.to_excel(writer, sheet_name='Resume_Global', index=False)

        print(f"✅ Rapport généré avec succès : {filename}")

    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    generer_rapport()
