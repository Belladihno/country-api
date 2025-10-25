import { Request, Response } from "express";
import  CountryService from "../services/country.service";
import path from "path";
import fs from "fs/promises";

class CountryController {
  async refreshCountries(req: Request, res: Response): Promise<void> {
    try {
      await CountryService.fetchAndRefreshCountries();
      res.status(200).json({
        message: "Countries refreshed successfully",
      });
    } catch (error: any) {
      if (error.message.includes("Could not fetch data")) {
        res.status(503).json({
          error: "External data source unavailable",
          details: error.message,
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }

  async getAllCountries(req: Request, res: Response): Promise<void> {
    try {
      const { region, currency, sort } = req.query;

      const countries = await CountryService.getAllCountries({
        region: region as string,
        currency: currency as string,
        sort: sort as string,
      });

      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getCountryByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const country = await CountryService.getCountryByName(name);

      if (!country) {
        res.status(404).json({
          error: "Country not found",
        });
        return;
      }

      res.status(200).json(country);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async deleteCountry(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const country = await CountryService.deleteCountry(name);

      if (!country) {
        res.status(404).json({
          error: "Country not found",
        });
        return;
      }

      res.status(200).json({
        message: "Country deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await CountryService.getStatus();
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getImage(req: Request, res: Response): Promise<void> {
    try {
      const imagePath = path.join(process.cwd(), "cache", "summary.svg");

      try {
        await fs.access(imagePath);
        res.setHeader("Content-Type", "image/svg+xml");
        res.sendFile(imagePath);
      } catch {
        res.status(404).json({
          error: "Summary image not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

export default new CountryController();
