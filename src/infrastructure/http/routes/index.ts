import { Router } from "express";
import { PlayerController, TeamController } from "../controllers/index";
import { teamRouter } from "./Team.router";
import { playerRouter } from './Player.router';

interface Controllers {
    teamController: TeamController;
    playerController: PlayerController;
}

export const createRoutes = (controllers: Controllers): Router => {
    const router = Router();

    router.use('/team', teamRouter(controllers.teamController));
    router.use('/player', playerRouter(controllers.playerController));

    return router;
}