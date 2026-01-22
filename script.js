let bChart, sChart;

const assets = {
    logos: {
        "Premier League": "images/logo-premier-league.png",
        "La Liga": "images/logo-laliga.png",
        "Serie A": "images/logo-seriea.jpeg",
        "Bundesliga": "images/logo-bundesliga.png",
        "Ligue 1": "images/logo-ligue1.jpg",
        "Liga Portugal": "images/logo-ligaportugal.png"
    },
    players: {
        "Viktor Gyökeres": "images/player-gyokeres.jpeg",
        "Kylian Mbappé": "images/player-mbappe.jpeg",
        "Mohamed Salah": "images/player-salah.jpg",
        "Harry Kane": "images/player-kane.jpeg",
        "Robert Lewandowski": "images/player-lewandowski.jpeg",
        "Mateo Retegui": "images/player-retegui.jpeg"
    }
};

function update() {
    const q = document.getElementById('search').value.toLowerCase();
    const l = document.getElementById('league').value;

    const filtered = playersData.filter(p => 
        p.joueur.toLowerCase().includes(q) && (l === 'all' || p.championnat === l)
    );

    document.getElementById('totalGoals').innerText = filtered.reduce((s, p) => s + p.buts, 0);

    if (filtered.length > 0) {
        const top = filtered[0];
        document.getElementById('playerName').innerText = top.joueur;
        document.getElementById('playerPhoto').src = assets.players[top.joueur] || "";
        document.getElementById('leagueName').innerText = top.championnat;
        document.getElementById('leagueLogo').src = assets.logos[top.championnat] || "";
    }

    document.getElementById('tableBody').innerHTML = filtered.map(p => `
        <tr><td>${p.rang}</td><td><strong>${p.joueur}</strong></td><td>${p.club}</td><td>${p.championnat}</td><td style="color:var(--accent); font-weight:bold">${p.buts}</td></tr>
    `).join('');

    renderCharts(filtered);
}

function renderCharts(data) {
    const ctxB = document.getElementById('bar').getContext('2d');
    const ctxS = document.getElementById('scatter').getContext('2d');
    if (bChart) bChart.destroy(); if (sChart) sChart.destroy();

    // ORDRE CROISSANT (Petit -> Grand)
    const sortedData = [...data].slice(0, 10).sort((a, b) => a.buts - b.buts);

    bChart = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: sortedData.map(p => p.joueur),
            datasets: [{ label: 'Buts', data: sortedData.map(p => p.buts), backgroundColor: '#38bdf8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    sChart = new Chart(ctxS, {
        type: 'scatter',
        data: {
            datasets: [{ label: 'Performance', data: data.map(p => ({x: p.minutes_jouees, y: p.buts})), backgroundColor: '#fbbf24' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function download(id) {
    const link = document.createElement('a');
    link.download = id + '.png';
    link.href = document.getElementById(id).toDataURL('image/png');
    link.click();
}

function exportCSV() {
    let csv = 'Rang,Joueur,Club,Ligue,Buts\n';
    playersData.forEach(p => csv += `${p.rang},${p.joueur},${p.club},${p.championnat},${p.buts}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export_stats.csv';
    link.click();
}

function renderCharts(data) {
    const ctxB = document.getElementById('bar').getContext('2d');
    const ctxS = document.getElementById('scatter').getContext('2d');
    if (bChart) bChart.destroy(); 
    if (sChart) sChart.destroy();

    // ORDRE CROISSANT pour le graphique en barres
    const sortedData = [...data].slice(0, 10).sort((a, b) => a.buts - b.buts);

    bChart = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: sortedData.map(p => p.joueur),
            datasets: [{ label: 'Buts', data: sortedData.map(p => p.buts), backgroundColor: '#38bdf8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // GRAPHIQUE D'EFFICACITÉ avec noms des joueurs
    sChart = new Chart(ctxS, {
        type: 'scatter',
        data: {
            datasets: [{ 
                label: 'Joueurs', 
                data: data.map(p => ({
                    x: p.minutes_jouees, 
                    y: p.buts,
                    name: p.joueur // On stocke le nom ici pour l'utiliser plus bas
                })), 
                backgroundColor: '#fbbf24',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        // C'est ici qu'on personnalise l'affichage au survol
                        label: function(context) {
                            const p = context.raw;
                            return `${p.name} : ${p.y} buts / ${p.x} min`;
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: 'Minutes Jouées', color: '#94a3b8' } },
                y: { title: { display: true, text: 'Buts', color: '#94a3b8' } }
            }
        }
    });
}

window.onload = update;