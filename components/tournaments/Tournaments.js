// src/tournaments/viewTournaments.js
export async function fetchTournaments() {
  const res = await fetch("/api/tournaments");
  return await res.json();
}

export function registerForTournament(tournamentId) {
  return fetch(`/api/tournaments/register/${tournamentId}`, {
    method: "POST",
  }).then((res) => res.json());
}
