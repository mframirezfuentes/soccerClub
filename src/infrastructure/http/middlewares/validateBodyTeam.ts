import { Request, Response, NextFunction } from "express";
import * as z from "zod";

export const validateBodyTeam = (schema: z.ZodSchema) => {
return (req: Request, res: Response, next: NextFunction) => {
 const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.format() });
    }

    req.body = validationResult.data;
    next();
}
}
