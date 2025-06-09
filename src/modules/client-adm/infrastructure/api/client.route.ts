import { Router, Request, Response, NextFunction } from "express";
import ClientAdmFacade from "../../facade/client-adm.facade";
import { AddClientFacadeInputDto } from "../../facade/client-adm.facade.dto";
import ClientAdmFacadeFactory from "../../factory/client-adm.facade.factory";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default function createClientRouter(facade: ClientAdmFacade = ClientAdmFacadeFactory.create()) {
  const router = Router();

  router.post("/clients", asyncHandler(async (req: Request, res: Response) => {
    const input: AddClientFacadeInputDto = req.body;
    const output = await facade.add(input);
    res.status(201).json(output);
  }));

  router.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: err?.message || "Internal server error" });
  });

  return router;
} 
