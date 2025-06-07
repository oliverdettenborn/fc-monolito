import { Router, Request, Response, NextFunction } from "express";
import InvoiceFacade from "../../facade/invoice.facade";

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default function createInvoiceRouter(facade: InvoiceFacade = new InvoiceFacade()) {
  const router = Router();

  router.post("/invoice", asyncHandler(async (req: Request, res: Response) => {
    const result = await facade.generate(req.body);
    res.status(200).json(result);
  }));

  router.get("/invoice/:id", asyncHandler(async (req: Request, res: Response) => {
    const result = await facade.find({ id: req.params.id });
    res.status(200).json(result);
  }));

  // Middleware de erro para garantir resposta 500
  router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err?.message || "Internal server error" });
  });

  return router;
} 
