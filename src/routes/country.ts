import { Router } from "express";
import CountryController from "../controller/country.controller";

const router = Router();

router.post("/refresh", CountryController.refreshCountries);

router.get("/image", CountryController.getImage);

router.get("/:name", CountryController.getCountryByName);

router.delete("/:name", CountryController.deleteCountry);

router.get("/", CountryController.getAllCountries);

export default router;
