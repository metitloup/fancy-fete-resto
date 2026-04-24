import json
import pandas as pd
from datetime import datetime

def generer_bilan_financier():
    try:
        # 1. Chargement des données
        with open('db.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
        with open('public/plats.json', 'r', encoding='utf-8') as f:
            config = json.load(f)

        hist = db.get('historique', [])
        if not hist:
            print("Rien à calculer, l'historique est vide !")
            return

        # 2. Dictionnaire de prix (mapping ID -> Prix)
        prix_map = {}
        for p in config['plats']:
            if not p.get('hasTaille'):
                prix_map[(p['id'], 'N/A')] = p.get('prix_unique', 0)
            else:
                prix_map[(p['id'], 'Adulte')] = p.get('prix_adulte', 0)
                prix_map[(p['id'], 'Enfant')] = p.get('prix_enfant', 0)

        # 3. Traitement des données
        df = pd.DataFrame(hist)
        
        # Calcul des prix et sous-totaux
        df['prix_unitaire'] = df.apply(lambda row: prix_map.get((row['plat'], row['taille']), 0), axis=1)
        df['sous_total'] = (df['prix_unitaire'] * df['qty']).round(2)
        df['heure'] = pd.to_datetime(df['timestamp'], unit='ms').dt.strftime('%H:%M')

        # 4. Création de la Synthèse Financière
        resume = df.groupby('plat').agg({
            'qty': 'sum',
            'sous_total': 'sum',
            'duree': 'mean'
        }).reset_index()
        
        resume.columns = ['Produit', 'Quantité', 'CA Total (€)', 'Temps Prépa Moyen (s)']
        
        # Arrondi des colonnes numériques du résumé
        resume['CA Total (€)'] = resume['CA Total (€)'].round(2)
        resume['Temps Prépa Moyen (s)'] = resume['Temps Prépa Moyen (s)'].round(0)

        # AJOUT DE LA LIGNE DE TOTAL GÉNÉRAL
        total_qty = resume['Quantité'].sum()
        total_ca = resume['CA Total (€)'].sum().round(2)
        
        # On crée une ligne de total sous forme de DataFrame pour le concaténer
        ligne_total = pd.DataFrame({
            'Produit': ['--- TOTAL GÉNÉRAL ---'],
            'Quantité': [total_qty],
            'CA Total (€)': [total_ca],
            'Temps Prépa Moyen (s)': [None]
        })
        
        resume_final = pd.concat([resume, ligne_total], ignore_index=True)

        # 5. Export Excel
        filename = f"Bilan_Financier_2026-04-24.xlsx"
        
        with pd.ExcelWriter(filename) as writer:
            # Onglet Journal
            df[['heure', 'plat', 'taille', 'qty', 'prix_unitaire', 'sous_total', 'duree']].to_excel(writer, sheet_name='Journal_Ventes', index=False)
            
            # Onglet Synthèse
            resume_final.to_excel(writer, sheet_name='Synthese_Financiere', index=False)

        print(f"💰 BILAN GÉNÉRÉ : {filename}")
        print(f"📈 Chiffre d'Affaires Total : {total_ca:.2f} €")
        print(f"📊 Nombre de plats servis : {total_qty}")

    except FileNotFoundError:
        print("Erreur : Assurez-vous que db.json et public/plats.json sont présents.")
    except Exception as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    generer_bilan_financier()
