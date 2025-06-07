import { Router, Request, Response, NextFunction } from "express";
import ProductAdmFacade from "../../facade/product-adm.facade";
import { AddProductFacadeInputDto } from "../../facade/product-adm.facade.dto";
import ProductAdmFacadeFactory from "../../factory/facade.factory";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default function createProductRouter(facade: ProductAdmFacade = ProductAdmFacadeFactory.create()) {
  const router = Router();

  router.post("/products", asyncHandler(async (req: Request, res: Response) => {
    const input: AddProductFacadeInputDto = req.body;
    await facade.addProduct(input);
    res.status(201).json(input);
  }));

  // Middleware de erro para garantir resposta 500
  router.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: err?.message || "Internal server error" });
  });

  return router;
} 
