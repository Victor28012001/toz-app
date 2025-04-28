export function renderTournaments(tournaments) {
    const list = document.getElementById('tournamentList');
    list.innerHTML = '';
    tournaments.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.name} - ${t.status}`;
      list.appendChild(li);
    });
  }
  