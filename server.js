const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

const users = { 'admin': 'resto2024', 'accueil': 'accueil' };

app.use(basicAuth({ users: users, challenge: true }));
app.use(express.static('public'));

app.get('/whoami', (req, res) => { res.json({ user: req.auth.user }); });

// --- INITIALISATION SÉCURISÉE DE LA DB ---
let db = { plateauxOccupes: [], commandesActives: [], commandesPretes: [], historique: [] };

if (fs.existsSync('db.json')) {
    try { 
        const data = JSON.parse(fs.readFileSync('db.json'));
        // On fusionne avec l'objet db par défaut pour s'assurer que chaque clé existe
        db = { ...db, ...data }; 
        console.log("Base de données chargée avec succès");
    } catch (e) { 
        console.log("Erreur lecture db.json, initialisation vide"); 
    }
}

function sauver() { fs.writeFileSync('db.json', JSON.stringify(db)); }

io.on('connection', (socket) => {
    // Envoi des données actuelles aux nouveaux connectés
    socket.emit('maj_plateaux', db.plateauxOccupes || []);
    
    if (db.commandesActives) {
        db.commandesActives.forEach(cmd => socket.emit('affichage_cuisine', cmd));
    }
    
    if (db.commandesPretes) {
        db.commandesPretes.forEach(cmd => socket.emit('notification_accueil', cmd));
    }

    socket.on('nouvelle_commande', (data) => {
        const tableNum = parseInt(data.num);
        if (data.num && !isNaN(tableNum) && db.plateauxOccupes.includes(tableNum)) {
            return socket.emit('erreur_table_prise', `La table ${tableNum} est déjà occupée !`);
        }

        data.timestampArrivee = Date.now();
        if (data.num && !isNaN(tableNum)) db.plateauxOccupes.push(tableNum);
        
        db.commandesActives.push(data);
        sauver();
        io.emit('maj_plateaux', db.plateauxOccupes);
        io.emit('affichage_cuisine', data);
    });

    socket.on('envoyer_flash_cuisine', (msg) => {
        io.emit('recevoir_flash_cuisine', msg);
    });

    socket.on('plateau_pret', (numPlateau) => {
        const idx = db.commandesActives.findIndex(c => c.num == numPlateau);
        if (idx !== -1) {
            const cmd = db.commandesActives[idx];
            cmd.duree = Math.round((Date.now() - cmd.timestampArrivee) / 1000);
            
            cmd.items.forEach(item => {
                db.historique.push({
                    plat: item.p, taille: item.t, cuisson: item.c, acc: item.a,
                    qty: item.qty, duree: cmd.duree, timestamp: Date.now()
                });
            });

            db.commandesPretes.push(cmd);
            db.commandesActives.splice(idx, 1);
            sauver();
            io.emit('notification_accueil', cmd);
        }
    });

    socket.on('confirmation_servi', (num) => {
        db.commandesPretes = db.commandesPretes.filter(c => c.num != num);
        const n = parseInt(num);
        if(!isNaN(n)) db.plateauxOccupes = db.plateauxOccupes.filter(item => item !== n);
        sauver();
        io.emit('maj_plateaux', db.plateauxOccupes);
    });

    socket.on('forcer_liberation', (num) => {
        const n = parseInt(num);
        db.plateauxOccupes = db.plateauxOccupes.filter(item => item !== n);
        db.commandesActives = db.commandesActives.filter(c => c.num != n);
        db.commandesPretes = db.commandesPretes.filter(c => c.num != n);
        sauver();
        io.emit('maj_plateaux', db.plateauxOccupes);
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

http.listen(3000, '0.0.0.0', () => console.log('Fancy Fête - Multi-tablettes Prêt sur port 3000'));
