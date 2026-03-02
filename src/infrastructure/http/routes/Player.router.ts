import { Router } from 'express';
import { PlayerController } from '../controllers';


export const playerRouter = (controller: PlayerController): Router => {
    const router = Router();

    router.get('/', (req, res) => controller.findAll(req, res));
    router.post('/', (req, res) => controller.save(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));

    return router;
}