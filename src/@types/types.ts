export interface ExternalCountry {
  name: string;
  capital?: string;
  region?: string;
  population: number;
  flag?: string;
  currencies?: Array<{ code: string; name?: string; symbol?: string }>;
}

export interface ExchangeRatesResponse {
  rates: Record<string, number>;
}

export interface CountryData {
  name: string;
  capital: string | null;
  region: string | null;
  population: number;
  currency_code: string | null;
  exchange_rate: number | null;
  estimated_gdp: number | null;
  flag_url: string | null;
}

export interface CountryFilters {
  region?: string;
  currency?: string;
  sort?: 'gdp_desc' | 'gdp_asc' | 'population_desc' | 'population_asc';
}