import {
  VolumeTrended,
  VolumeTransformedData,
  apesPolicyId,
  cabinsPolicyId,
  cotasPolicyId,
} from "@/lib/constants";
import { cookies } from "next/headers";

type VolumeResponse = {
  price: number;
  sales: number;
  time: number;
  volume: number;
};

async function fetchVolume(policyId: string): Promise<VolumeTrended[]> {
  const response = await fetch(
    `https://openapi.taptools.io/api/v1/nft/collection/volume/trended?policy=${policyId}&interval=1d&numIntervals=180`,
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

  const data: VolumeResponse[] = await response.json();
  return data.map((item) => ({
    date: new Date(item.time * 1000).toISOString(),
    price: item.price,
    sales: item.sales,
    volume: item.volume,
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
  const apeVolume: VolumeTrended[] = await fetchVolume(apesPolicyId);
  const cabinVolume: VolumeTrended[] = await fetchVolume(cabinsPolicyId);
  const cotasVolume: VolumeTrended[] = await fetchVolume(cotasPolicyId);
  const volumeData: VolumeTransformedData[] = apeVolume.map((item, index) => ({
    date: item.date,
    apes: item.volume,
    cabins: cabinVolume[index].volume,
    cotas: cotasVolume[index].volume,
  }));

  try {
    return new Response(
      JSON.stringify({
        volumeData: volumeData,
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
