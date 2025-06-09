import { Router, Request, Response, NextFunction } from "express";
import CheckoutFacade from "../../facade/checkout.facade";
import CheckoutFacadeFactory from "../../factory/checkout.facade.factory";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default function createCheckoutRouter(facade: CheckoutFacade = CheckoutFacadeFactory.create()) {
  const router = Router();

  router.post("/checkout", asyncHandler(async (req: Request, res: Response) => {
    const result = await facade.placeOrder(req.body);
    res.status(201).json(result);
  }));

  router.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: err?.message || "Internal server error" });
  });

  return router;
} 
