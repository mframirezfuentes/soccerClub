import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import TeamPlayersPage from './pages/TeamPlayersPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <header className="navbar">
        <span className="navbar-brand">⚽ Soccer Club</span>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Equipos
          </NavLink>
          <NavLink to="/players" className={({ isActive }) => isActive ? 'active' : ''}>
            Jugadores
          </NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/teams/:id/players" element={<TeamPlayersPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
