import {
  ListingsTrended,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";
import { cookies } from "next/headers";

type ListingsTrendedResponse = {
  listings: number;
  price: number;
  time: number;
};

async function fetchListingsTrended(
  policyId: string,
): Promise<ListingsTrended[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/listings/trended?policy=${policyId}&interval=1d&numIntervals=180`,
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

  const data: ListingsTrendedResponse[] = await response.json();
  return data.map((item) => ({
    date: new Date(item.time * 1000).toISOString(),
    listings: item.listings,
  }));
}

export async function GET(request: Request) {
  cookies();
  if (
    typeof process.env.TAPTOOLS_API_KEY !== "string" ||
    process.env.TAPTOOLS_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Taptools API key");
  }
  const apeListings: ListingsTrended[] =
    await fetchListingsTrended(apesPolicyId);
  const cabinListings: ListingsTrended[] =
    await fetchListingsTrended(cabinsPolicyId);
  const cotasListings: ListingsTrended[] =
    await fetchListingsTrended(cotasPolicyId);

  try {
    return new Response(
      JSON.stringify({
        apes: apeListings,
        cabins: cabinListings,
        cotas: cotasListings,
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
