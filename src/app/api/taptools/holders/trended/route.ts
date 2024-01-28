import {
  HoldersTrended,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";
import { cookies } from "next/headers";

type HoldersTrendedResponse = {
  holders: number;
  time: number;
};

async function fetchHoldersTrended(
  policyId: string,
): Promise<HoldersTrended[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/holders/trended?policy=${policyId}&timeframe=180d`,
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

  const data: HoldersTrendedResponse[] = await response.json();
  return data.map((item) => ({
    date: new Date(item.time * 1000).toISOString(),
    holders: item.holders,
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
  const apeHolders: HoldersTrended[] = await fetchHoldersTrended(apesPolicyId);
  const cabinHolders: HoldersTrended[] =
    await fetchHoldersTrended(cabinsPolicyId);
  const cotasHolders: HoldersTrended[] =
    await fetchHoldersTrended(cotasPolicyId);

  try {
    return new Response(
      JSON.stringify({
        apes: apeHolders,
        cabins: cabinHolders,
        cotas: cotasHolders,
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
