# ⚽ Football Club Management API

REST API for managing women's football clubs and players, built with **Node.js**, **TypeScript**, and **Neo4j** as graph database. Implements **Hexagonal Architecture** and **Domain-Driven Design** principles.

---

## 🏗️ Architecture

This project follows Hexagonal Architecture (also known as Ports and Adapters), separating the codebase into three main layers:

```
src/
├── domain/                        # Core business logic (no external dependencies)
│   ├── entities/                  # Team, Player
│   ├── repositories/              # ITeamRepository, IPlayerRepository (ports)
│
├── application/                   # Use cases (orchestrates the domain)
│   └── use-cases/
│       ├── Team/                  # ListTeamsUseCase, FindByTeamUseCase
│       └── Player/                # ListPlayersUseCase, FindPlayerByIdUseCase
│
├── infrastructure/                # Adapters (implement the ports)
│   ├── persistence/               # Neo4j repositories + connection
│   ├── http/
│   │   ├── controllers/           # TeamController, PlayerController
│   │   └── routes/                # Express routers
│   └── config/
│       └── app.ts                 # Dependency injection composition root
│
└── scripts/                       # Data seeding scripts
    ├── teams_data.ts
    └── players_data.ts
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime and language |
| Express | HTTP framework |
| Neo4j | Graph database |
| Docker | Database containerization |
| tsx | TypeScript execution (dev) |
| dotenv | Environment variables |
| uuid | ID generation |

---

## ⚙️ Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- npm v9+

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/futbolClub.git
cd futbolClub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=
NEO4J_URI=
NEO4J_USER=
NEO4J_PASSWORD=
```

### 4. Start the database

Make sure Docker Desktop is running, then:

```bash
docker compose up -d
```

Verify Neo4j is running:

```bash
docker compose ps
```

Neo4j browser will be available at: `http://localhost:7474`
- **User:** `neo4j`
- **Password:** `r@ndomp4ss`

### 5. Seed the database

Load teams first, then players:

```bash
npm run load:teams
npm run load:players
```

### 6. Start the server

```bash
npm run dev
```

Server will be running at: `http://localhost:3000`

---

## 📡 API Endpoints

### Teams

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/team` | Get all teams |
| GET | `/api/v1/team/:name` | Get team by name |

### Players

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/player` | Get all players |
| GET | `/api/v1/player/:id` | Get player by id |

---

## 🗃️ Graph Model

```
(Player)-[:PLAYS_FOR]->(Team)
```

Each player node is connected to its team node through a `PLAYS_FOR` relationship. This allows querying the full graph of players and their clubs efficiently.

**Example query in Neo4j Browser:**
```cypher
MATCH (p:Player)-[:PLAYS_FOR]->(t:Team)
RETURN p, t
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled build |
| `npm run load:teams` | Seed teams data into Neo4j |
| `npm run load:players` | Seed players data into Neo4j |
| `npm run delete:teams` | Delete all teams from Neo4j |
| `npm run delete:players` | Delete all players from Neo4j |

---

## 🔑 Key Architecture Decisions

**Dependency Injection** — all dependencies are instantiated in `app.ts` and injected downward. No layer creates its own dependencies.

**Interface-based repositories** — use cases depend on `ITeamRepository` and `IPlayerRepository` interfaces, not on concrete Neo4j implementations. Swapping the database only requires a new repository implementation.

**DETACH DELETE** — when deleting a node in Neo4j, `DETACH DELETE` is used to automatically remove all relationships along with the node.

---

## 📁 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NEO4J_URI` | Neo4j connection URI | `bolt://localhost:7687` |
| `NEO4J_USER` | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j password | `r@ndomp4ss` |

---

## 📄 License

MIT
