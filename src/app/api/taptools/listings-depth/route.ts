import {
  ListingsDepthResponse,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";
import { cookies } from "next/headers";

async function fetchListingsDepth(
  policyId: string,
): Promise<ListingsDepthResponse[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/listings/depth?policy=${policyId}&items=100`,
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

  const data: ListingsDepthResponse[] = await response.json();
  return data;
}

export async function GET(request: Request) {
  cookies();
  if (
    typeof process.env.TAPTOOLS_API_KEY !== "string" ||
    process.env.TAPTOOLS_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Taptools API key");
  }
  const apeListingsDepth: ListingsDepthResponse[] =
    await fetchListingsDepth(apesPolicyId);
  const cabinListingsDepth: ListingsDepthResponse[] =
    await fetchListingsDepth(cabinsPolicyId);
  const cotasListingsDepth: ListingsDepthResponse[] =
    await fetchListingsDepth(cotasPolicyId);

  try {
    return new Response(
      JSON.stringify({
        apes: apeListingsDepth,
        cabins: cabinListingsDepth,
        cotas: cotasListingsDepth,
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
