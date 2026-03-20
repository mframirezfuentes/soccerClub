import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Player, Team } from '../types';
import { getPlayers } from '../api/players';
import { getTeamById } from '../api/teams';

export default function TeamPlayersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [teamData, playersData] = await Promise.all([
          getTeamById(id),
          getPlayers(id),
        ]);
        setTeam(teamData);
        setPlayers(playersData);
      } catch {
        setError('No se pudieron cargar los datos del equipo.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Volver
          </button>
          <h1>{team ? `${team.name} — Jugadores` : 'Cargando...'}</h1>
        </div>
      </div>

      {team && (
        <div className="team-info">
          <span>{team.city}</span>
          <span>·</span>
          <span>{team.country}</span>
          <span>·</span>
          <span>{team.stadium}</span>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : players.length === 0 ? (
        <p className="empty">Este equipo no tiene jugadores registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Posición</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.age}</td>
                <td>{player.position}</td>
                <td>{player.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && players.length > 0 && (
        <p className="team-count">{players.length} jugador{players.length !== 1 ? 'as' : 'a'}</p>
      )}
    </div>
  );
}
