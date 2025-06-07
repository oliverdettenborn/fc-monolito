import { Router } from "express";
import InvoiceFacade from "../../facade/invoice.facade";
import InvoiceRepository from "../../repository/invoice.repository";

export default function createInvoiceRouter(facade: InvoiceFacade = new InvoiceFacade(new InvoiceRepository())) {
  const router = Router();

  router.post("/invoice", async (req, res) => {
    try {
      const invoice = await facade.generate(req.body);
      res.status(201).json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/invoice/:id", async (req, res) => {
    try {
      const invoice = await facade.find({ id: req.params.id });
      res.status(200).json(invoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
} 
