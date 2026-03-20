import type { Team, TeamFormData } from '../types';

const BASE = '/api/v1/teams';

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Error al obtener equipos');
  return res.json();
}

export async function getTeamById(id: string): Promise<Team> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Equipo no encontrado');
  return res.json();
}

export async function createTeam(data: TeamFormData): Promise<Team> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear equipo');
  return res.json();
}

export async function updateTeam(id: string, data: TeamFormData): Promise<Team> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar equipo');
  return res.json();
}

export async function deleteTeam(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar equipo');
}
