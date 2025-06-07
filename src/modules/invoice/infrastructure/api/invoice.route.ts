import { Router } from "express";
import InvoiceFacade from "../../facade/invoice.facade";

const router = Router();
const facade = new InvoiceFacade();

router.post("/invoice", async (req, res) => {
  try {
    const result = await facade.generate(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

router.get("/invoice/:id", async (req, res) => {
  try {
    const result = await facade.find({ id: req.params.id });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

export default router; 
