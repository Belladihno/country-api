import axios from "axios";
import prisma from "../prisma/client";
import { generateSummaryImage } from "../utils/image.generator";
import {
  CountryData,
  ExchangeRatesResponse,
  ExternalCountry,
} from "../@types/types";

const COUNTRIES_API =
  "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies";
const EXCHANGE_API = "https://open.er-api.com/v6/latest/USD";

class CountryService {
  async fetchAndRefreshCountries(): Promise<void> {
    try {
      const countriesResponse = await axios.get<ExternalCountry[]>(
        COUNTRIES_API,
        {
          timeout: 10000,
        }
      );
      const countries = countriesResponse.data;

      const ratesResponse = await axios.get<ExchangeRatesResponse>(
        EXCHANGE_API,
        {
          timeout: 10000,
        }
      );
      const rates = ratesResponse.data.rates;

      const timestamp = new Date();

      for (const country of countries) {
        const currencyCode = country.currencies?.[0]?.code || null;
        const exchangeRate =
          currencyCode && rates[currencyCode] ? rates[currencyCode] : null;

        let estimatedGdp: number | null = null;
        if (currencyCode && exchangeRate) {
          const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
          estimatedGdp = (country.population * randomMultiplier) / exchangeRate;
        } else if (!currencyCode) {
          estimatedGdp = 0;
        }

        const countryData: CountryData = {
          name: country.name,
          capital: country.capital || null,
          region: country.region || null,
          population: country.population,
          currency_code: currencyCode,
          exchange_rate: exchangeRate,
          estimated_gdp: estimatedGdp,
          flag_url: country.flag || null,
        };

        await prisma.country.upsert({
          where: { name: countryData.name },
          update: {
            ...countryData,
            last_refreshed_at: timestamp,
          },
          create: {
            ...countryData,
            last_refreshed_at: timestamp,
          },
        });
      }

      await generateSummaryImage(timestamp);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiName = error.config?.url?.includes("restcountries")
          ? "restcountries.com"
          : "open.er-api.com";
        throw new Error(`Could not fetch data from ${apiName}`);
      }
      throw error;
    }
  }

  async getAllCountries(filters: {
    region?: string;
    currency?: string;
    sort?: string;
  }) {
    const where: any = {};

    if (filters.region) {
      where.region = filters.region;
    }

    if (filters.currency) {
      where.currency_code = filters.currency;
    }

    let orderBy: any = {};
    if (filters.sort === "gdp_desc") {
      orderBy = { estimated_gdp: "desc" };
    } else if (filters.sort === "gdp_asc") {
      orderBy = { estimated_gdp: "asc" };
    } else if (filters.sort === "population_desc") {
      orderBy = { population: "desc" };
    } else if (filters.sort === "population_asc") {
      orderBy = { population: "asc" };
    }

    return prisma.country.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
    });
  }

  async getCountryByName(name: string) {
    const countries = await prisma.$queryRaw<any[]>`
      SELECT * FROM Country 
      WHERE LOWER(name) = LOWER(${name})
      LIMIT 1
    `;

    return countries.length > 0 ? countries[0] : null;
  }

  async deleteCountry(name: string) {
    const country = await this.getCountryByName(name);

    if (!country) {
      return null;
    }

    await prisma.country.delete({
      where: { id: country.id },
    });

    return country;
  }

  async getStatus() {
    const count = await prisma.country.count();
    const lastRefreshed = await prisma.country.findFirst({
      orderBy: { last_refreshed_at: "desc" },
      select: { last_refreshed_at: true },
    });

    return {
      total_countries: count,
      last_refreshed_at: lastRefreshed?.last_refreshed_at || null,
    };
  }
}

export default new CountryService();
