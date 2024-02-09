import { cabinsPolicyId } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type AssetDetailsResponse = {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: {
    name: string;
    rate: string;
    files: Array<{
      src: string;
      name: string;
      mediaType: string;
    }>;
    image: string;
    Street: string;
    District: string;
    mediaType: string;
    "Cabin Size": string;
    "SLVD Rating": string;
    description: string;
    "X Coordinate": string;
    "Y Coordinate": string;
  };
  onchain_metadata_standard: string;
  onchain_metadata_extra: null;
  metadata: null;
};

type AddressAssetsResponse = {
  unit: string;
  quantity: string;
};

function isValidStakeKey(stakeKey: string): boolean {
  const regex = /^stake1[0-9a-z]{54}$/;
  return regex.test(stakeKey);
}

async function fetchCabinIds(
  addressAssets: AddressAssetsResponse[],
): Promise<string[]> {
  const cabinNames: string[] = [];

  for (const asset of addressAssets) {
    const response = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}`,
      {
        headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API call failed for asset " + asset.unit + " with response:",
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

    const assetDetails: AssetDetailsResponse = await response.json();
    const cleanedName =
      "cabin" + assetDetails.onchain_metadata.name.replace(/[., ]/g, "");
    cabinNames.push(cleanedName);
  }

  return cabinNames;
}

async function fetchAddressAssets(
  stakeKey: string,
  policyId: string,
): Promise<AddressAssetsResponse[]> {
  let assets: AddressAssetsResponse[] = [];
  let page = 1;
  const count = 100;

  while (true) {
    const response = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/accounts/${stakeKey}/addresses/assets?count=${count}&page=${page}`,
      {
        headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API call failed for stake key " + stakeKey + " with response:",
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

    const data: AddressAssetsResponse[] = await response.json();
    const filteredData = data.filter((asset) =>
      asset.unit.startsWith(policyId),
    );
    assets = assets.concat(filteredData);

    if (data.length < count) {
      break;
    }

    page++;
  }

  return assets;
}

export async function GET(request: NextRequest) {
  cookies();
  const stakeKey = request.nextUrl.searchParams.get("stakeKey");

  if (!stakeKey || !isValidStakeKey(stakeKey)) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing stake address" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (
    typeof process.env.BLOCKFROST_API_KEY !== "string" ||
    process.env.BLOCKFROST_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Blockfrost API key");
  }

  try {
    const addressCabins = await fetchAddressAssets(stakeKey, cabinsPolicyId);
    const cabinIds: string[] = await fetchCabinIds(addressCabins);
    return new Response(JSON.stringify({ cabinIds: cabinIds }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
