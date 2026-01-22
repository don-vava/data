let chartBar, chartScatter;

const imgConfig = {
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

function updateDashboard() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const league = document.getElementById('leagueFilter').value;

    const filtered = playersData.filter(p => 
        p.joueur.toLowerCase().includes(search) && (league === 'all' || p.championnat === league)
    );

    document.getElementById('totalGoals').innerText = filtered.reduce((acc, p) => acc + p.buts, 0);
    
    if (filtered.length > 0) {
        const top = filtered[0];
        document.getElementById('topPlayerName').innerText = top.joueur;
        document.getElementById('playerImg').src = imgConfig.players[top.joueur] || "";
        document.getElementById('leagueName').innerText = top.championnat;
        document.getElementById('leagueImg').src = imgConfig.logos[top.championnat] || "";
    }

    document.getElementById('playerTable').innerHTML = filtered.map(p => `
        <tr><td>${p.rang}</td><td><strong>${p.joueur}</strong></td><td>${p.club}</td><td style="color:var(--accent)">${p.buts}</td><td style="color:#fbbf24">${p.passes}</td><td>${p.championnat}</td></tr>
    `).join('');

    renderCharts(filtered);
}

function renderCharts(data) {
    const barCtx = document.getElementById('barChart').getContext('2d');
    const scatterCtx = document.getElementById('scatterChart').getContext('2d');
    if (chartBar) chartBar.destroy(); if (chartScatter) chartScatter.destroy();

    // Barres : Tri Croissant
    const sorted = [...data].slice(0, 10).sort((a, b) => a.buts - b.buts);

    chartBar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: sorted.map(p => p.joueur),
            datasets: [
                { label: 'Buts', data: sorted.map(p => p.buts), backgroundColor: '#38bdf8' },
                { label: 'Passes', data: sorted.map(p => p.passes), backgroundColor: '#fbbf24' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Scatter : Noms au survol
    chartScatter = new Chart(scatterCtx, {
        type: 'scatter',
        data: {
            datasets: [{ 
                label: 'Joueurs', 
                data: data.map(p => ({ x: p.minutes_jouees, y: p.buts, name: p.joueur, ast: p.passes })), 
                backgroundColor: 'rgba(251, 191, 36, 0.7)', pointRadius: 6
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false,
            plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw.name}: ${ctx.raw.y} Buts, ${ctx.raw.ast} Passes (${ctx.raw.x} min)` } } }
        }
    });
}

function download(canvasId, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = document.getElementById(canvasId).toDataURL();
    link.click();
}

function exportCSV() {
    let csv = 'Rang,Joueur,Club,Buts,Passes,Ligue\n';
    playersData.forEach(p => csv += `${p.rang},${p.joueur},${p.club},${p.buts},${p.passes},${p.championnat}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'stats_football.csv';
    link.click();
}

window.onload = updateDashboard;