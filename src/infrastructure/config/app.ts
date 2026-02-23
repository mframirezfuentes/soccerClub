import express from 'express'
import { createRoutes } from '../http/routes';
import { Neo4jTeamRepository, Neo4jPlayerRepository } from '../persistence/index';
import { ListTeamsUseCase, FindByTeamUseCase } from '../../application/use-cases/Team/index';
import { TeamController } from '../http/controllers/TeamController';
import { Player } from '../../domain/entities/Player';
import { PlayerController } from '../http/controllers';


export const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //repositories
    const teamRepository = new Neo4jTeamRepository();
    const playerRepository = new Neo4jPlayerRepository();

    //caso de uso
    const listTeamsUseCase = new ListTeamsUseCase(teamRepository);
    const findTeamByNameUseCase = new FindByTeamUseCase(teamRepository);

    //Controllers
    const teamController = new TeamController(listTeamsUseCase, findTeamByNameUseCase);
    const playerController = new PlayerController(playerRepository);

    //routes
    app.use('/api/v1', createRoutes({ teamController, playerController }));

    return app;
}