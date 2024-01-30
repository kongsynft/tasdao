import { daoStakeKey, societyUnit, DaoTreasury } from "@/lib/constants";
import { cookies } from "next/headers";

type TokenMcapResponse = {
  circSupply: number;
  fdv: number;
  mcap: number;
  price: number;
  ticker: string;
  totalSupply: number;
};

type TokenQuoteResponse = {
  price: number;
};

type PortfolioPositionResponse = {
  adaBalance: number;
  adaValue: number;
  liquidValue: number;
  numFTs: number;
  numNFTs: number;
  positionsFt?: PositionFt[] | null;
  positionsLp?: PositionLp[] | null;
  positionsNft?: PositionNft[] | null;
};

type PositionFt = {
  "24h": number;
  "30d": number;
  "7d": number;
  adaValue: number;
  balance: number;
  fingerprint: string;
  liquidBalance: number;
  liquidValue: number;
  price: number;
  ticker: string;
  unit: string;
};

type PositionLp = {
  adaValue: number;
  amountLP: number;
  ticker: string;
  tokenA: string;
  tokenAAmount: number;
  tokenAName: string;
  tokenB: string;
  tokenBAmount: number;
  tokenBName: string;
  unit: string;
};

type PositionNft = {
  "24h": number;
  "30d": number;
  "7d": number;
  adaValue: number;
  balance: number;
  floorPrice: number;
  liquidValue: number;
  listings: number;
  name: string;
  policy: string;
};

async function fetchPortfolioPosition(
  stakeKey: string,
): Promise<PortfolioPositionResponse> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/wallet/portfolio/positions?address=${stakeKey}`,
    {
      headers: {
        "x-api-key": process.env.TAPTOOLS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "API call failed for policy ID " + stakeKey + " with response:",
      {
        endpoint: response.url,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      },
    );
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: PortfolioPositionResponse = await response.json();
  return data;
}

async function fetchTokenPrice(unit: string): Promise<number> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/token/mcap?unit=${unit}`,
    {
      headers: {
        "x-api-key": process.env.TAPTOOLS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API call failed for unit " + unit + " with response:", {
      endpoint: response.url,
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText,
    });
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: TokenMcapResponse = await response.json();
  return data.price;
}

async function fetchUsdPrice(): Promise<number> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/token/quote?quote=USD`,
    {
      headers: {
        "x-api-key": process.env.TAPTOOLS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API call failed with response:", {
      endpoint: response.url,
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText,
    });
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: TokenQuoteResponse = await response.json();
  return data.price;
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  } else {
    return value.toString();
  }
}

function transformData(
  data: PortfolioPositionResponse,
  adaSocPrice: number,
  usdAdaPrice: number,
): DaoTreasury {
  const adaBalance = data.adaBalance;
  let socBalance: number;

  if (data.positionsFt) {
    const position = data.positionsFt.find((item) => item.unit === societyUnit);
    socBalance = position?.balance as number;
  } else {
    throw new Error("No positions found in data.positionsFt");
  }

  const result: number = adaBalance + socBalance * adaSocPrice;
  const daoTreasuryADA: string = formatNumber(result);
  const daoTreasuryUSD: string = formatNumber(result * usdAdaPrice);

  return {
    daoTreasuryADA,
    daoTreasuryUSD,
  };
}

export async function GET(request: Request) {
  cookies();
  if (
    typeof process.env.TAPTOOLS_API_KEY !== "string" ||
    process.env.TAPTOOLS_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Taptools API key");
  }
  const daoPortfolio = await fetchPortfolioPosition(daoStakeKey);
  const adaSocPrice = await fetchTokenPrice(societyUnit);
  const usdAdaPrice = await fetchUsdPrice();
  const result: DaoTreasury = transformData(
    daoPortfolio,
    adaSocPrice,
    usdAdaPrice,
  );

  try {
    return new Response(
      JSON.stringify({
        daoTreasuryADA: result.daoTreasuryADA,
        daoTreasuryUSD: result.daoTreasuryUSD,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
