import express from 'express'
import { createRoutes } from '../http/routes';
import { Neo4jTeamRepository, Neo4jPlayerRepository } from '../persistence/index';
import { CreateTeamUseCase, ListTeamsUseCase, DeleteTeamUseCase, UpdateTeamUseCase, FindByIdTeamUseCase } from '../../application/use-cases/Team';
import { ListOfPlayerUserCase, CreatePlayerUseCase, DeletePlayerUseCase, AssignToTeamUseCase } from '../../application/use-cases/Player';
import { TeamController } from '../http/controllers/TeamController';
import { PlayerController } from '../http/controllers';


export const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //repositories
    const teamRepository = new Neo4jTeamRepository();
    const playerRepository = new Neo4jPlayerRepository();

    //caso de uso team
    const listTeamsUseCase = new ListTeamsUseCase(teamRepository);
    const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);
    const updateTeamUseCase = new UpdateTeamUseCase(teamRepository)
    const findByIdTeamUseCase = new FindByIdTeamUseCase(teamRepository)
    const createTeamUseCase = new CreateTeamUseCase(teamRepository);

    //caso de uso players
    const listPlayersUseCase = new ListOfPlayerUserCase(playerRepository);
    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository);
    const deletePlayerUseCase = new DeletePlayerUseCase(playerRepository);
    const assignToTeamUseCase = new AssignToTeamUseCase(playerRepository, teamRepository);

    //Controllers
    const teamController = new TeamController(createTeamUseCase,
        listTeamsUseCase, findByIdTeamUseCase,
        deleteTeamUseCase, updateTeamUseCase
    );
    const playerController = new PlayerController(listPlayersUseCase, createPlayerUseCase, deletePlayerUseCase, assignToTeamUseCase);

    //routes
    app.use('/api/v1', createRoutes({ teamController, playerController }));

    return app;
}