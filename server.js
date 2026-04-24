const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

// Configuration des accès
const users = { 'admin': 'resto2024', 'accueil': 'accueil' };

app.use(basicAuth({ users: users, challenge: true }));
app.use(express.static('public'));

// Route pour identifier l'utilisateur (Admin ou Accueil)
app.get('/whoami', (req, res) => { res.json({ user: req.auth.user }); });

// --- INITIALISATION DE LA BASE DE DONNÉES ---
let db = { plateauxOccupes: [], commandesActives: [], commandesPretes: [], historique: [] };

if (fs.existsSync('db.json')) {
    try {
        const data = JSON.parse(fs.readFileSync('db.json'));
        db = { ...db, ...data };
        console.log("Base de données chargée avec succès");
    } catch (e) {
        console.log("Erreur lecture db.json, initialisation vide");
    }
}

function sauver() { fs.writeFileSync('db.json', JSON.stringify(db)); }

io.on('connection', (socket) => {
    // Synchronisation initiale du nouvel utilisateur connecté
    socket.emit('maj_plateaux', db.plateauxOccupes || []);

    if (db.commandesActives) {
        db.commandesActives.forEach(cmd => socket.emit('affichage_cuisine', cmd));
    }

    if (db.commandesPretes) {
        db.commandesPretes.forEach(cmd => socket.emit('notification_accueil', cmd));
    }

    // --- RÉCEPTION D'UNE COMMANDE ---
    socket.on('nouvelle_commande', (data) => {
        const tableNum = parseInt(data.num);

        // On vérifie si la table est déjà prise (sauf si c'est de l'EXPRESS)
        if (data.num !== "⚡ EXPRESS" && !isNaN(tableNum) && db.plateauxOccupes.includes(tableNum)) {
            return socket.emit('erreur_table_prise', `La table ${tableNum} est déjà occupée !`);
        }

        data.timestampArrivee = Date.now();

        // On occupe la table seulement si c'est un numéro
        if (data.num !== "⚡ EXPRESS" && !isNaN(tableNum)) {
            db.plateauxOccupes.push(tableNum);
        }

        db.commandesActives.push(data);
        sauver();

        io.emit('maj_plateaux', db.plateauxOccupes);
        io.emit('affichage_cuisine', data);
    });

    // --- COMMUNICATION FLASH (ACCUEIL -> CUISINE) ---
    socket.on('envoyer_flash_cuisine', (msg) => {
        io.emit('recevoir_flash_cuisine', msg);
    });

    // --- CUISINE DÉCLARE LE PLATEAU PRÊT ---
    socket.on('plateau_pret', (numPlateau) => {
        const idx = db.commandesActives.findIndex(c => c.num == numPlateau);
        if (idx !== -1) {
            const cmd = db.commandesActives[idx];
            cmd.duree = Math.round((Date.now() - cmd.timestampArrivee) / 1000);

            // On enregistre chaque article dans l'historique pour les stats
            cmd.items.forEach(item => {
                db.historique.push({
                    plat: item.p, taille: item.t, cuisson: item.c, acc: item.a,
                    qty: item.qty, duree: cmd.duree, timestamp: Date.now()
                });
            });

            db.commandesPretes.push(cmd);
            db.commandesActives.splice(idx, 1);
            sauver();

            // On prévient toutes les tablettes d'accueil
            io.emit('notification_accueil', cmd);
        }
    });

    // --- ACCUEIL CONFIRME LE SERVICE (PLATEAU LIVRÉ) ---
    socket.on('confirmation_servi', (num) => {
        // Supprime de la liste des commandes prêtes
        db.commandesPretes = db.commandesPretes.filter(c => c.num != num);

        // Libère la table dans la grille
        const n = parseInt(num);
        if(!isNaN(n)) {
            db.plateauxOccupes = db.plateauxOccupes.filter(item => item !== n);
        }

        sauver();

        // SYNCHRONISATION : On prévient TOUT LE MONDE de supprimer la bulle notif
        io.emit('maj_plateaux', db.plateauxOccupes);
        io.emit('confirmation_servi', num);
    });

    // --- LIBÉRATION MANUELLE ---
    socket.on('forcer_liberation', (num) => {
        const n = parseInt(num);
        db.plateauxOccupes = db.plateauxOccupes.filter(item => item !== n);
        db.commandesActives = db.commandesActives.filter(c => c.num != n);
        db.commandesPretes = db.commandesPretes.filter(c => c.num != n);
        sauver();
        io.emit('maj_plateaux', db.plateauxOccupes);
        io.emit('confirmation_servi', num); // Supprime les bulles notif aussi
        io.emit('supprimer_ticket_cuisine', num);
    });

    socket.on('demande_stats', () => socket.emit('envoi_stats', db.historique || []));

    socket.on('purger_tout', () => {
        db = { plateauxOccupes: [], commandesActives: [], commandesPretes: [], historique: [] };
        sauver();
        io.emit('maj_plateaux', []);
        io.emit('envoi_stats', []);
    });
});

// Écoute sur toutes les interfaces réseau du serveur Fedora sur le port 3000
http.listen(3000, '0.0.0.0', () => console.log('🚀 Fancy Fête - Serveur prêt sur le port 3000'));
