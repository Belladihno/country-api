import fs from "fs/promises";
import path from "path";
import prisma from "../prisma/client";

export const generateSummaryImage = async (timestamp: Date): Promise<void> => {
  const totalCountries = await prisma.country.count();

  const top5 = await prisma.country.findMany({
    orderBy: { estimated_gdp: "desc" },
    take: 5,
    select: {
      name: true,
      estimated_gdp: true,
    },
  });

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f8f9fa"/>
  
  <text x="400" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#212529">
    Country Data Summary
  </text>
  
  <text x="400" y="120" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#495057">
    Total Countries: ${totalCountries}
  </text>
  
  <text x="400" y="180" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#212529">
    Top 5 Countries by Estimated GDP
  </text>
  
  ${top5
    .map(
      (country, index) => `
  <text x="100" y="${
    240 + index * 50
  }" font-family="Arial, sans-serif" font-size="18" fill="#495057">
    ${index + 1}. ${country.name}
  </text>
  <text x="500" y="${
    240 + index * 50
  }" font-family="Arial, sans-serif" font-size="18" fill="#6c757d">
    $${country.estimated_gdp ? country.estimated_gdp.toFixed(2) : "0.00"}
  </text>
  `
    )
    .join("")}
  
  <text x="400" y="540" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6c757d">
    Last Updated: ${timestamp.toISOString()}
  </text>
</svg>`;

  const cacheDir = path.join(process.cwd(), "cache");
  await fs.mkdir(cacheDir, { recursive: true });

  const imagePath = path.join(cacheDir, "summary.svg");
  await fs.writeFile(imagePath, svgContent, "utf-8");
};
