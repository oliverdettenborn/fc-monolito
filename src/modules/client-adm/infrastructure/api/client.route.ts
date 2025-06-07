import { Router, Request, Response, NextFunction } from "express";
import ClientAdmFacade from "../../facade/client-adm.facade";
import { AddClientFacadeInputDto } from "../../facade/client-adm.facade.dto";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default function createClientRouter(facade: ClientAdmFacade) {
  const router = Router();

  router.post("/clients", asyncHandler(async (req: Request, res: Response) => {
    const input: AddClientFacadeInputDto = req.body;
    await facade.add(input);
    res.status(201).json(input);
  }));

  // Middleware de erro para garantir resposta 500
  router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err?.message || "Internal server error" });
  });

  return router;
} 
