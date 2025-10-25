import { Router } from "express";
import countryRoutes from "../routes/country";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.use("/countries", countryRoutes);

export default router;