import { useEffect, useState } from 'react';
import type { Player, PlayerFormData, Team } from '../types';
import { getPlayers, createPlayer, updatePlayer, deletePlayer, assignPlayerToTeam } from '../api/players';
import { getTeams } from '../api/teams';

const EMPTY_FORM: PlayerFormData = { name: '', age: 18, position: '', country: '', teamId: '' };

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Player | null>(null);
  const [form, setForm] = useState<PlayerFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [playersData, teamsData] = await Promise.all([getPlayers(), getTeams()]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch {
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (player: Player) => {
    setEditTarget(player);
    setForm({
      name: player.name,
      age: player.age,
      position: player.position,
      country: player.country,
      teamId: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let playerId: string;
      if (editTarget) {
        await updatePlayer(editTarget.id, form);
        playerId = editTarget.id;
      } else {
        const created = await createPlayer(form);
        playerId = created.id;
      }
      if (form.teamId) {
        await assignPlayerToTeam(playerId, form.teamId);
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este jugador?')) return;
    try {
      await deletePlayer(id);
      await load();
    } catch {
      setError('Error al eliminar el jugador.');
    }
  };

  const teamNames = (teamIds: string[]) => {
    if (!teamIds || teamIds.length === 0) return '—';
    return teamIds
      .map(id => teams.find(t => t.id === id)?.name ?? id)
      .join(', ');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Jugadores</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo jugador</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editTarget ? 'Editar jugador' : 'Nuevo jugador'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name" type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Edad</label>
                <input
                  id="age" type="number" min={1} max={99} value={form.age} required
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">País</label>
                <input
                  id="country" type="text" value={form.country} required
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Posición</label>
                <input
                  id="position" type="text" value={form.position} required
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="teamId">
                  {editTarget ? 'Asignar a equipo' : 'Equipo (opcional)'}
                </label>
                <select
                  id="teamId" value={form.teamId ?? ''}
                  onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                >
                  <option value="">Sin equipo</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : players.length === 0 ? (
        <p className="empty">No hay jugadores registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>País</th>
              <th>Posición</th>
              <th>Equipos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.age}</td>
                <td>{player.country}</td>
                <td>{player.position}</td>
                <td>{teamNames(player.teamIds)}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(player)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(player.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
