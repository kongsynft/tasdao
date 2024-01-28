import {
  TopHolder,
  TopHolderWithRank,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";
import { cookies } from "next/headers";

async function fetchTopHolders(policyId: string): Promise<TopHolderWithRank[]> {
  const excludeAddress =
    "addr1vx6h45xms7c62ww5daxwwl4mtm9p7mnx0u74w5x5pmwpcnss67sft";

  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/holders/top?policy=${policyId}&perPage=100&page=1&excludeExchanges=1`,
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

  let data: TopHolder[] = await response.json();
  return data
    .filter((holder) => holder.address !== excludeAddress)
    .map((holder, index) => ({
      ...holder,
      rank: index + 1, // Add rank starting from 1
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
  const apeTopHolders: TopHolderWithRank[] =
    await fetchTopHolders(apesPolicyId);
  const cabinTopHolders: TopHolderWithRank[] =
    await fetchTopHolders(cabinsPolicyId);
  const cotasTopHolders: TopHolderWithRank[] =
    await fetchTopHolders(cotasPolicyId);

  try {
    return new Response(
      JSON.stringify({
        apes: apeTopHolders,
        cabins: cabinTopHolders,
        cotas: cotasTopHolders,
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
