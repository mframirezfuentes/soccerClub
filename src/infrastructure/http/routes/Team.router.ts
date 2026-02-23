import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { validateBodyTeam, teamSchema } from "../middlewares/index";

export const teamRouter = (controller: TeamController): Router => {
    const router = Router();

    router.get("/", (req, res) => controller.findAll(req, res));
    router.get("/:name", (req, res) => controller.findById(req, res));
    router.post("/", validateBodyTeam(teamSchema), (req, res) => controller.save(req, res));
    router.put("/:name", validateBodyTeam(teamSchema), (req, res) => controller.save(req, res));

    return router;
}