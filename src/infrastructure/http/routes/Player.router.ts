import { Router } from 'express';
import { PlayerController } from '../controllers';


export const playerRouter = (controller: PlayerController): Router => {
    const router = Router();

    router.get('/', (req, res) => controller.findAll(req, res));
    //router.get('/:id', controller.getPlayerById.bind(controller));
    //router.post('/', controller.createPlayer.bind(controller));
    //router.put('/:id', controller.updatePlayer.bind(controller));
    //router.delete('/:id', controller.deletePlayer.bind(controller));

    return router;
}