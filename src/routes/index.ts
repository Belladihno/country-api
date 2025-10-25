import { Router } from "express";
import countryRoutes from "../routes/country";
import CountryController from "../controller/country.controller";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.get("/status", CountryController.getStatus); 

router.use("/countries", countryRoutes);

export default router;