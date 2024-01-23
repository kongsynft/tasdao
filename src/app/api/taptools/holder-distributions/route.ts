import {
  HolderDistributions,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";

async function fetchHolderDistributions(
  policyId: string,
): Promise<HolderDistributions> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/holders/distribution?policy=${policyId}`,
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

  const data: HolderDistributions = await response.json();
  return data;
}

export async function GET(request: Request) {
  if (
    typeof process.env.TAPTOOLS_API_KEY !== "string" ||
    process.env.TAPTOOLS_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Taptools API key");
  }

  const apeDistributions: HolderDistributions =
    await fetchHolderDistributions(apesPolicyId);
  const cabinDistributions: HolderDistributions =
    await fetchHolderDistributions(cabinsPolicyId);
  const cotasDistributions: HolderDistributions =
    await fetchHolderDistributions(cotasPolicyId);

  try {
    return new Response(
      JSON.stringify({
        apes: apeDistributions,
        cabins: cabinDistributions,
        cotas: cotasDistributions,
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
