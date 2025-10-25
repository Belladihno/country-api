# Country API

A RESTful API built with Node.js, Express, and Prisma that provides country data including population, GDP estimates, exchange rates, and flag images. The API fetches data from external sources and stores it in a MySQL database.

**Live Demo**: `https://country-api-production-02da.up.railway.app`

## Features

- Fetch and store country data from external APIs
- Get all countries with filtering and sorting options
- Search countries by name
- Calculate estimated GDP based on population and exchange rates
- Generate summary images with top 5 countries by GDP
- RESTful API endpoints
- MySQL database with Prisma ORM
- TypeScript support
- Deployed on Railway

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Image Processing**: Sharp
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Logging**: Morgan

## API Endpoints

### Base URL

`https://country-api-production-02da.up.railway.app`


### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/status` | Get database status (total countries, last refresh time) |
| POST | `/countries/refresh` | Refresh country data from external APIs |
| GET | `/countries` | Get all countries (supports filtering & sorting) |
| GET | `/countries/:name` | Get country by name |
| DELETE | `/countries/:name` | Delete a country by name |
| GET | `/countries/image` | Get summary image (top 5 countries by GDP) |

### Query Parameters

**GET `/countries`**
- `region` - Filter by region (e.g., Africa, Europe, Asia)
- `currency` - Filter by currency code (e.g., USD, EUR)
- `sort` - Sort results:
  - `gdp_desc` - Sort by GDP (highest first)
  - `gdp_asc` - Sort by GDP (lowest first)
  - `population_desc` - Sort by population (highest first)
  - `population_asc` - Sort by population (lowest first)

### Example Requests

```bash
# Get API status
curl https://country-api-production-02da.up.railway.app/status

# Get all countries
curl https://country-api-production-02da.up.railway.app/countries

# Filter by region
curl https://country-api-production-02da.up.railway.app/countries?region=Africa

# Sort by GDP
curl https://country-api-production-02da.up.railway.app/countries?sort=gdp_desc

# Get specific country
curl https://country-api-production-02da.up.railway.app/countries/Nigeria

# Refresh data
curl -X POST https://country-api-production-02da.up.railway.app/countries/refresh
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Belladihno/country-api.git
cd country-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=7000
DATABASE_URL="mysql://root:your-password@localhost:3306/country_api"
```

4. **Set up the database**

Run Prisma migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. **Build the project**
```bash
npm run build
```

6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:7000`

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `7000` |
| `DATABASE_URL` | MySQL connection string | Yes | - |

### DATABASE_URL Format
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Example:
```
mysql://root:mypassword@localhost:3306/country_api
```

## Running Locally

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Running Migrations
```bash
# Apply pending migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name
```

## Deployment

This project is deployed on Railway. To deploy your own instance:

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and add:
   - A MySQL database service
   - Your GitHub repository

3. **Set environment variables** in Railway:
   - `NODE_ENV=production`
   - `DATABASE_URL` (use variable reference to MySQL service)

4. **Railway will automatically**:
   - Install dependencies
   - Run build command
   - Run Prisma migrations
   - Start the server

## Project Structure

```
country-api/
├── src/
│   ├── @types/          # TypeScript type definitions
│   ├── config/          # Configuration files
│   ├── controller/      # Route controllers
│   ├── prisma/          # Prisma client instance
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.ts        # Main application entry
├── prisma/
│   ├── migrations/      # Database migrations
│   └── schema.prisma    # Prisma schema
├── cache/               # Generated images cache
├── dist/                # Compiled JavaScript
├── .env                 # Environment variables
├── .env.example         # Example env file
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Dependencies

### Production Dependencies
- `@prisma/client` - Prisma ORM client
- `axios` - HTTP client for external APIs
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `express` - Web framework
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `sharp` - Image processing

### Development Dependencies
- `@types/*` - TypeScript type definitions
- `typescript` - TypeScript compiler
- `prisma` - Prisma CLI
- `ts-node` - TypeScript execution
- `nodemon` - Development server with hot reload

## External APIs Used

- **REST Countries API**: `https://restcountries.com/v2/all`
- **Exchange Rates API**: `https://open.er-api.com/v6/latest/USD`

## Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server

# Database
npm run prisma       # Run Prisma CLI commands
```

## License

This project is licensed under the ISC License.

## Author

ABimbola Omisakin - `https://github.com/Belladihno`

## Acknowledgments

- REST Countries API for providing country data
- Exchange Rates API for currency exchange rates
- Railway for hosting platform