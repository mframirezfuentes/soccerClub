import type { Player, PlayerFormData } from '../types';

const BASE = '/api/v1/players';

export async function getPlayers(teamId?: string): Promise<Player[]> {
  const url = teamId ? `${BASE}?teamId=${encodeURIComponent(teamId)}` : BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener jugadores');
  return res.json();
}

export async function createPlayer(data: PlayerFormData): Promise<Player> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear jugador');
  return res.json();
}

export async function updatePlayer(id: string, data: PlayerFormData): Promise<Player> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar jugador');
  return res.json();
}

export async function deletePlayer(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar jugador');
}

export async function assignPlayerToTeam(playerId: string, teamId: string): Promise<void> {
  const res = await fetch(`${BASE}/${playerId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  if (!res.ok) throw new Error('Error al asignar jugador');
}
