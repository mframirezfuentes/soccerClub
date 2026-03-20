import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Team, TeamFormData } from '../types';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../api/teams';

const EMPTY_FORM: TeamFormData = { name: '', country: '', city: '', stadium: '' };

export default function TeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | null>(null);
  const [form, setForm] = useState<TeamFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeams();
      setTeams(data);
    } catch {
      setError('No se pudieron cargar los equipos.');
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

  const openEdit = (team: Team) => {
    setEditTarget(team);
    setForm({ name: team.name, country: team.country, city: team.city, stadium: team.stadium });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateTeam(editTarget.id, form);
      } else {
        await createTeam(form);
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
    if (!confirm('¿Eliminar este equipo?')) return;
    try {
      await deleteTeam(id);
      await load();
    } catch {
      setError('Error al eliminar el equipo.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Equipos</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo equipo</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editTarget ? 'Editar equipo' : 'Nuevo equipo'}</h2>
            <form onSubmit={handleSubmit} className="form">
              {(['name', 'country', 'city', 'stadium'] as const).map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{labels[field]}</label>
                  <input
                    id={field}
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                  />
                </div>
              ))}
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
      ) : teams.length === 0 ? (
        <p className="empty">No hay equipos registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>País</th>
              <th>Ciudad</th>
              <th>Estadio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.country}</td>
                <td>{team.city}</td>
                <td>{team.stadium}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-primary" onClick={() => navigate(`/teams/${team.id}/players`)}>Ver jugadores</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(team)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(team.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const labels: Record<keyof TeamFormData, string> = {
  name: 'Nombre',
  country: 'País',
  city: 'Ciudad',
  stadium: 'Estadio',
};
