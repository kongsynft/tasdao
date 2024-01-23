import {
  DatePrice,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
  societyUnit,
} from "@/lib/constants";

type TaptoolsOHLCV = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
  volume: number;
};
export const revalidate = 3600;

async function fetchNFTPriceData(policyId: string): Promise<DatePrice[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/ohlcv?policy=${policyId}&interval=1d&numIntervals=180`,
    {
      headers: {
        "x-api-key": process.env.TAPTOOLS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "API call failed for policy ID " + policyId + " with response:",
      {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      },
    );
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: TaptoolsOHLCV[] = await response.json();
  return data.map((item) => ({
    date: new Date(item.time * 1000).toISOString(),
    price: item.close,
  }));
}

async function fetchTokenPriceData(unit: string): Promise<DatePrice[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/token/ohlcv?unit=${unit}&interval=1d&numIntervals=180`,
    {
      headers: {
        "x-api-key": process.env.TAPTOOLS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API call failed for policy ID " + unit + " with response:", {
      status: response.status,
      statusText: response.statusText,
      errorBody: errorText,
    });
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: TaptoolsOHLCV[] = await response.json();
  return data.map((item) => ({
    date: new Date(item.time * 1000).toISOString(),
    price: item.close,
  }));
}

export async function GET() {
  if (
    typeof process.env.TAPTOOLS_API_KEY !== "string" ||
    process.env.TAPTOOLS_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Taptools API key");
  }

  try {
    const apesData: DatePrice[] = await fetchNFTPriceData(apesPolicyId);
    const cabinsData: DatePrice[] = await fetchNFTPriceData(cabinsPolicyId);
    const cotasData: DatePrice[] = await fetchNFTPriceData(cotasPolicyId);
    const societyData: DatePrice[] = await fetchTokenPriceData(societyUnit);

    return new Response(
      JSON.stringify({
        apes: apesData,
        cabins: cabinsData,
        cotas: cotasData,
        society: societyData,
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
